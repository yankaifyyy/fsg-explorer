import * as THREE from 'three';
import { IContourSceneData } from '../../models/contour';
import HeightCalculator from './heightmap-calculator';


export default class StopCalculator {
    static readonly SampleSize = 64;

    hCalc!: HeightCalculator;

    minInterval: number = 0.01;

    buffer = new Float32Array(StopCalculator.SampleSize * StopCalculator.SampleSize * 4);

    constructor(private renderer: THREE.WebGLRenderer) {
        this.init();
    }

    calculate(data: IContourSceneData, fracs: number[]) {
        this.hCalc.calculate(data);

        const ss = StopCalculator.SampleSize;

        this.renderer.readRenderTargetPixels(this.hCalc.getRenderTarget(), 0, 0, ss, ss, this.buffer);

        return this.pickStops(fracs);
    }

    calculateMax(data: IContourSceneData) {
        this.hCalc.calculate(data);

        const ss = StopCalculator.SampleSize;

        this.renderer.readRenderTargetPixels(this.hCalc.getRenderTarget(), 0, 0, ss, ss, this.buffer);

        return this.maxVal();
    }

    private maxVal() {
        const arr = this.buffer.filter((v, i) => v >= 0.5 && i % 4 === 0);

        if (arr.length > 0) {
            let mv = this.minInterval;
            arr.forEach((v) => (mv = Math.max(mv, v)));

            return mv;
        } else {
            return this.minInterval;
        }
    }

    private pickStops(fracs: number[]) {
        let res = fracs.map(() => 1);

        const arr = this.buffer.filter((v, i) => v >= 0.5 && i % 4 === 0);

        if (arr.length > 0) {
            const len = arr.length;

            arr.sort((a, b) => a - b);
            const maxVal = Math.max(1, arr[len - 1]);

            res = fracs.map((v, i) => {
                const index = Math.round(v * len);
                return index >= 0 && index < len ? arr[index] : maxVal;
            });
        }

        for (let i = 1; i < fracs.length; ++i) {
            res[i] = Math.max(res[i], res[i - 1] + this.minInterval);
        }

        return res;
    }

    private init() {
        const ss = StopCalculator.SampleSize;

        this.hCalc = new HeightCalculator(ss, ss, this.renderer);

        return null;
    }
}
