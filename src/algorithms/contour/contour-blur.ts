import * as THREE from 'three';
import { IContourParam } from '../../components/Contour';
import { IDot } from '../../models/contour';
import { createContourSceneData } from './contour-mesh-helpers';
import HeightCalculator from './heightmap-calculator';
import StopCalculator from './stop-calculator';


const vShader = `
varying vec2 vUv;

void main() {
    vUv = vec2(uv.x, 1.0 - uv.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fShaderBase = `
precision highp float;

varying vec2 vUv;

uniform sampler2D hmap;

uniform sampler2D bmap;

void main() {
    float val = texture2D(hmap, vUv).x;

    vec4 oriColor = texture2D(bmap, vec2(vUv.x, 1.0 - vUv.y));

    vec4 col = vec4(.0);

    if (val >= .0) {
        // col = mix(vec4(.0), contour, val / maxval);
        col = getColor(val);
    }

    gl_FragColor = oriColor + col;
}
`;

const copyShader = `
precision highp float;

varying vec2 vUv;

uniform sampler2D tex;

void main() {
    gl_FragColor = texture2D(tex, vec2(vUv.x, 1.0 - vUv.y));
}
`;

export class ContourBlurer {
    heightmapCalculator!: HeightCalculator;

    NSTOPS: number = 7;
    stopCalculator!: StopCalculator;
    stops: number[] = [0, 0, 0, 0, 0];

    private rt!: THREE.WebGLRenderTarget;

    private tmpRt!: THREE.WebGLRenderTarget;
    private tmpMesh!: THREE.Mesh;

    private mesh!: THREE.Mesh;
    private camera!: THREE.Camera;

    constructor(private sizeX: number, private sizeY: number, private renderer: THREE.WebGLRenderer) {
        this.init();
    }

    draw(data: IDot[], vbox: [number, number, number, number], param: IContourParam) {
        const bufferScene = new THREE.Scene();
        bufferScene.add(this.mesh);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.camera.position.set(0, 0, 2);

        bufferScene.add(this.camera);

        const contourSceneData = createContourSceneData(data, param.kernelRadius, vbox);

        this.stops = this.stopCalculator.calculate(contourSceneData, param.levels.map((d) => d.frac));

        this.renderer.setClearColor('#000000', 0);
        this.renderer.clearTarget(this.rt, true, false, false);
        this.renderer.autoClear = false;

        this.renderer.setRenderTarget(this.tmpRt);
        this.renderer.clearColor();

        if (data.length > 0) {
            const sceneData = createContourSceneData(data, param.kernelRadius, vbox);
            this.heightmapCalculator.calculate(sceneData);

            const material = this.mesh.material as THREE.ShaderMaterial;

            material.uniforms.hmap.value = this.heightmapCalculator.getRenderTarget().texture;
            material.uniforms.bmap.value = this.tmpRt.texture;

            for (let i = 0; i < this.NSTOPS; ++i) {
                material.uniforms[`contour${i}`].value = param.levels[i].color;
                material.uniforms[`stops${i}`].value = this.stops[i];
            }

            this.renderer.setRenderTarget(this.rt);
            this.renderer.autoClear = false;
            this.renderer.render(bufferScene, this.camera, this.rt, false);

            const tmpScene = new THREE.Scene();
            tmpScene.add(this.tmpMesh);

            const tmpCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
            tmpCamera.position.set(0, 0, 2);

            tmpScene.add(this.tmpMesh);
            tmpScene.add(tmpCamera);

            this.renderer.render(tmpScene, tmpCamera, this.tmpRt, true);
        }
    }

    getRenderTarget() {
        return this.tmpRt;
    }

    private init() {
        this.rt = new THREE.WebGLRenderTarget(this.sizeX, this.sizeY);
        this.tmpRt = new THREE.WebGLRenderTarget(this.sizeX, this.sizeY);

        this.renderer.clearTarget(this.rt, true, true, true);

        const defs: any[] = [];
        for (let i = 0; i < this.NSTOPS; ++i) {
            defs.push(`uniform vec4 contour${i};`);
            defs.push(`uniform float stops${i};`);
        }

        const trans: any[] = [];
        for (let i = this.NSTOPS - 1; i > 0; --i) {
            trans.push(`if (val >= stops${i}) return contour${i};`);
        }

        const getColorFunc = `
        vec4 getColor(float val) {
            ${trans.join('\n')}
            else {
                return vec4(1.0, 1.0, 1.0, 1.0);
            }
        }
        `;

        const fShaderCode = `
        precision highp float;
        ${defs.join('\n')}
        ${getColorFunc}
        ${fShaderBase}
        `;

        console.log(fShaderCode);

        const uniforms: any = {
            hmap: { value: 1 },
            bmap: { value: this.tmpRt.texture },
        };
        for (let i = 0; i < this.NSTOPS; ++i) {
            uniforms[`contour${i}`] = { value: [0, 0, 0, 0] };
            uniforms[`stops${i}`] = { value: 1 };
        }

        const geom = new THREE.PlaneGeometry(2, 2);

        this.mesh = new THREE.Mesh(
            geom,
            new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: fShaderCode,
                uniforms,
            }),
        );

        const uniforms2: any = {
            tex: { value: this.rt.texture },
        };

        this.tmpMesh = new THREE.Mesh(
            geom,
            new THREE.ShaderMaterial({
                vertexShader: vShader,
                fragmentShader: copyShader,
                uniforms: uniforms2,
            }),
        );

        this.heightmapCalculator = new HeightCalculator(this.sizeX, this.sizeY, this.renderer);
        this.stopCalculator = new StopCalculator(this.renderer);
    }
}
