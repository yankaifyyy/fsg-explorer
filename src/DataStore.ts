import { action, computed, observable } from 'mobx';
import doLayout from './algorithms/doLayout';
import { mdsOnData } from './algorithms/mds';
import { getViewbox } from './algorithms/viewbox';

export interface IContourParam {
    kernelRadius: number;
}

export class DataStore {
    @observable dataSource: string = 'eucore';

    @observable graphData: any = null;

    @observable showContour: boolean = true;
    @observable showDiagram: boolean = false;
    @observable showDiagramEdge: boolean = false;
    @observable filterOutMode: number = 0;

    @observable subgraphs: any = [];

    @observable searchedSubgraphs: any[] | null = null;

    @observable searchTolerance: number = 0;

    graphEdgeArrayCopy: any = [];

    @observable selectedPatternId: number | null = null;
    @observable selectedPatternNodes: Set<string> | null = null;

    @observable hoveredPattern: number | null = null;

    @observable contour: IContourParam = {
        kernelRadius: 64
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
            this.searchedSubgraphs.forEach(g => {
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
        fetch(`data/${this.dataSource}/graph.json`)
            .then(res => res.json())
            .then(r1 => {
                this.graphEdgeArrayCopy = r1.links.map((e: any) => ({
                    ...e,
                    source: r1.nodes[e.source],
                    target: r1.nodes[e.target]
                }));
                this.graphData = r1;
            });

        const features = await fetch(`data/${this.dataSource}/features.csv`)
            .then(res => res.text())
            .then(res => {
                const lines = res.trim().split('\n');
                const features = [];
                for (let i = 1; i < lines.length; ++i) {
                    const fea = lines[i].split(',').slice(1).map(v => +v);
                    features.push(fea);
                }
                return features;
            });

        const coords = mdsOnData(features);

        fetch(`data/${this.dataSource}/desc.txt`)
            .then(res => res.text())
            .then(async res => {
                const params: any = {};
                res.split('\n')
                    .forEach(l => {
                        const p = l.split(':');
                        params[p[0]] = p[1];
                    });

                if (params.subgraphs !== undefined) {
                    const subgs = [];
                    for (let i = 0; i < +params.subgraphs; ++i) {
                        const subg = await fetch(`data/${this.dataSource}/${i}.json`)
                            .then(res => res.json());
                        subgs.push(doLayout(subg));
                    }

                    const viewbox = getViewbox(subgs);
                    subgs.forEach(g => g.viewBox = viewbox);
                    subgs.forEach((g, i) => {
                        g.index = i;
                        g.viewBox = viewbox;
                        g.feature = features[i];
                        g.coords = coords[i];
                    });
                    this.subgraphs = subgs;
                }
            });
    }
};

export const store = new DataStore();
