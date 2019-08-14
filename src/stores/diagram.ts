import { action, observable } from 'mobx';
import { AppStore } from '.';

export interface IContourParam {
    kernelRadius: number;
}

export class DiagramStore {
    @observable showContour = true;

    @observable showDiagram = true;
    @observable showDiagramEdge = false;
    @observable filterOutMode = 0;

    @observable contour: IContourParam = {
        kernelRadius: 64,
    };

    constructor(private parent: AppStore) {}

    @action.bound
    setShowContour(val: boolean) {
        this.showContour = val;
    }

    @action.bound
    setShowDiagram(val: boolean) {
        this.showDiagram = val;
    }

    @action.bound
    setShowDiagramEdge(val: boolean) {
        this.showDiagramEdge = val;
    }

    @action.bound
    setFilterOutMode(val: number) {
        this.filterOutMode = val;
    }
}
