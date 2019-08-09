import * as React from 'react';

import { ContourBlurer } from '../algorithms/contour/contour-blur';
import { IDot } from '../models/contour';
import * as THREE from 'three';

import { observer } from 'mobx-react';

export interface IContourLevel {
    frac: number;
    color: number[];
}

export interface IContourParam {
    levels: IContourLevel[];
    kernelRadius: number;
}

export interface IContourProps {
    data: IDot[];
    width: number;
    height: number;

    vbox: [number, number, number, number];

    param: IContourParam;
}

export default class Contour extends React.Component<IContourProps, any> {
    refs!: {
        viewCanvas: HTMLCanvasElement;
    };

    scene!: THREE.Scene;
    camera!: THREE.Camera;
    mesh!: THREE.Mesh;
    renderer!: THREE.WebGLRenderer;

    frameId?: number;

    blurer!: ContourBlurer;

    componentDidMount() {
        this.setupRenderer();
        this.setupCalculator();
        this.setupScene();

        this.updateScene(this.props);

        this.updateFrame();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.camera.position.set(0, 0, 2);

        this.scene.add(this.camera);

        const geom = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            map: this.blurer.getRenderTarget().texture,
        });
        this.mesh = new THREE.Mesh(geom, material);
        this.scene.add(this.mesh);
    }

    componentWillUnmount() {
        if (this.frameId !== undefined) {
            cancelAnimationFrame(this.frameId);
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }
        if (this.mesh) {
            if (this.scene) {
                this.scene.remove(this.mesh);
            }
            this.mesh.geometry.dispose();
        }
        this.renderer.dispose();
    }

    componentWillUpdate(props: IContourProps, state: any) {
        this.updateScene(props);
    }

    setupRenderer() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.refs.viewCanvas,
        });
        this.renderer.setClearColor('#FFFFFF', 1);
        this.renderer.clear();

        this.renderer.setClearColor('#000000', 0);
    }

    setupCalculator() {
        this.blurer = new ContourBlurer(this.props.width, this.props.height, this.renderer);
    }

    updateFrame() {
        this.frameId = requestAnimationFrame(this.updateFrame.bind(this));

        this.renderer.setRenderTarget(undefined);
        this.renderer.setClearColor('#ffffff', 1);
        this.renderer.clear();
        if (this.renderer && this.scene && this.props.data.length > 0) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    render() {
        const { width, height } = this.props;

        const sty = {
            // width: '100%',
            // height: '100%',
        };

        const onWheel = (e: any) => {
            console.log(e);
        }

        return (
            <div>
                <canvas style={sty} width={width} height={height} onWheel={onWheel} ref="viewCanvas" />
            </div>
        );
    }

    private updateScene({ data, vbox, param }: IContourProps) {
        if (data === undefined || data.length === 0) {
            return;
        }

        this.blurer.draw(data, vbox, param);
    }
}
