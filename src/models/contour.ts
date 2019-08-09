import * as THREE from 'three';

export interface IDot {
    x: number;
    y: number;
    intensity?: number;
}

export interface IContourSceneData {
    mesh: THREE.Mesh;
    camera: THREE.Camera;
}
