import { action, computed, observable, runInAction } from 'mobx';
import doLayout from '../algorithms/doLayout';
import { mdsOnData } from '../algorithms/mds';
import { getViewbox } from '../algorithms/viewbox';

import { getGraphData } from '../local-server-api';

export interface IContourParam {
    kernelRadius: number;
}

export class AppStore {
    @observable public dataSource: string = 'eucore';

    @observable public graphData: any = null;

    @observable public showContour: boolean = true;
    @observable public showDiagram: boolean = false;
    @observable public showDiagramEdge: boolean = false;
    @observable public filterOutMode: number = 0;

    @observable public subgraphs: any = [];

    @observable public searchedSubgraphs: any[] | null = null;

    @observable public searchTolerance: number = 0;

    public graphEdgeArrayCopy: any = [];

    @observable public selectedPatternId: number | null = null;
    @observable public selectedPatternNodes: Set<string> | null = null;

    @observable public hoveredPattern: number | null = null;

    @observable public contour: IContourParam = {
        kernelRadius: 64,
    };

    @action.bound public setSearchTolerance(val: number) {
        this.searchTolerance = val;
    }

    @action.bound public setFilterOutMode(val: number) {
        this.filterOutMode = val;
    }

    @action.bound public setSearchedSubraphs(val: any[] | null) {
        this.searchedSubgraphs = val;
    }

    @action.bound public selectPattern(p: any) {
        if (p === null) {
            this.selectedPatternId = null;
            this.selectedPatternNodes = null;
        } else {
            this.selectedPatternId = p.index;
            this.selectedPatternNodes = new Set(p.nodes.map((d: any) => d.label));
        }
    }

    @computed public get searchSubgraphNodes() {
        const lst: any = [];
        if (this.searchedSubgraphs) {
            this.searchedSubgraphs.forEach((g) => {
                g.forEach((d: any) => {
                    lst.push(d.index);
                });
            });
            return new Set(lst);
        } else {
            return null;
        }
    }

    @action.bound public setShowContour(val: boolean) {
        this.showContour = val;
    }

    @action.bound public setShowDiagram(val: boolean) {
        this.showDiagram = val;
    }

    @action.bound public setShowDiagramEdge(val: boolean) {
        this.showDiagramEdge = val;
    }

    @action.bound public setContourRadius(val: number) {
        this.contour.kernelRadius = val;
    }

    @action.bound public setDataSource(val: string) {
        this.dataSource = val;
    }

    @action.bound public setPatternHover(val: number | null) {
        this.hoveredPattern = val;
    }

    @action.bound public async loadData() {
        console.log('Loading from ');
        console.log(this.dataSource);

        const data = await getGraphData(this.dataSource);
        const coords2 = mdsOnData(data.features);
        const subgs = data.subgraphs.map(doLayout);
        const viewbox = getViewbox(subgs);
        subgs.forEach((g, i) => {
            g.index = i;
            g.viewBox = viewbox;
            g.feature = data.features[i];
            g.coords = coords2[i];
        });

        this.graphEdgeArrayCopy = data.graph.links.map((e: any) => ({
            ...e,
            source: data.graph.nodes[e.source],
            target: data.graph.nodes[e.target],
        }));
        runInAction(() => {
            this.graphData = data.graph;
            this.subgraphs = subgs;
        });
    }
}

export const createStore = () => new AppStore();
export type TStore = ReturnType<typeof createStore>;
