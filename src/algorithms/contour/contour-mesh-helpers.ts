import * as THREE from 'three';
import { IContourSceneData, IDot } from '../../models/contour';

const vShader = `
varying vec3 offxy_intz;

void main() {
    offxy_intz = vec3(2.0 * (uv - vec2(.5, .5)), position.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, 1.0, 1.0);
}
`;

const fShader = `
precision highp float;

varying vec3 offxy_intz;

void main() {
    vec2 off = offxy_intz.xy;

    float intensity = offxy_intz.z;

    float decay = (1.0 - smoothstep(0.0, 1.0, length(off)));

    // gl_FragColor = vec4(0.0);
    gl_FragColor = vec4(intensity * decay);
}
`;

function createDotBufferGeometry(data: IDot[], r: number) {
    const geom = new THREE.BufferGeometry();

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    data.forEach((d, i) => {
        const idx = i * 4;
        const { x, y, intensity = 1 } = d;

        vertices.push(x - r, y - r, intensity);
        vertices.push(x - r, y + r, intensity);
        vertices.push(x + r, y + r, intensity);
        vertices.push(x + r, y - r, intensity);

        uvs.push(0, 1);
        uvs.push(0, 0);
        uvs.push(1, 0);
        uvs.push(1, 1);

        // C.W.
        indices.push(idx + 1, idx + 0, idx + 2);
        indices.push(idx + 0, idx + 3, idx + 2);
    });

    geom.setIndex(indices);
    geom.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    return geom;
}

const material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
});

export function createContourMesh(data: IDot[], r: number): THREE.Mesh {
    const geom = createDotBufferGeometry(data, r);

    geom.computeBoundingBox();

    return new THREE.Mesh(geom, material);
}

function adjustCamera(vbox: [number, number, number, number]) {
    if (vbox[2] > vbox[3]) {
        const delta = vbox[2] - vbox[3];
        return [vbox[0], vbox[0] + vbox[2], vbox[1] + vbox[3] + 0.5 * delta, vbox[1] - 0.5 * delta];
    } else {
        const delta = vbox[3] - vbox[2];
        return [vbox[0] - 0.5 * delta, vbox[0] + vbox[2] + 0.5 * delta, vbox[1] + vbox[3], vbox[1]];
    }
}

export function createContourSceneData(data: IDot[], r: number, vbox: [number, number, number, number]): IContourSceneData {
    const mesh = createContourMesh(data, r);

    const cambox = adjustCamera(vbox);

    const camera = new THREE.OrthographicCamera(cambox[0], cambox[1], cambox[2], cambox[3], 1, 10);
    camera.position.set(0, 0, 2);

    return {
        mesh,
        camera,
    };
}
