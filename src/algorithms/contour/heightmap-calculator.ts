import * as THREE from 'three';
import { IContourSceneData } from '../../models/contour';

export default class HeightCalculator {
    private rt!: THREE.WebGLRenderTarget;

    constructor(private sizeX: number, private sizeY: number, private renderer: THREE.WebGLRenderer) {
        this.init();
    }

    calculate({ mesh, camera }: IContourSceneData) {
        this.renderer.setRenderTarget(this.rt);
        this.renderer.setClearColor('#000000', 0);

        const bufferScene = new THREE.Scene();
        bufferScene.add(mesh);
        bufferScene.add(camera);

        this.renderer.clearTarget(this.rt, true, false, false);
        this.renderer.render(bufferScene, camera, this.rt, false);
    }

    getRenderTarget(): THREE.WebGLRenderTarget {
        return this.rt;
    }

    private init() {
        if (!this.renderer.extensions.get('OES_texture_float')) {
            console.error('No OES_texture_float support for float textures.');
            return false;
        }
        if (this.renderer.capabilities.maxVertexTextures === 0) {
            console.error('No support for vertex shader textures.');
            return false;
        }

        this.rt = new THREE.WebGLRenderTarget(this.sizeX, this.sizeY, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            stencilBuffer: false,
            depthBuffer: false,
        });

        return null;
    }
}
