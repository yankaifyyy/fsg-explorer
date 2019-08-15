import { action, computed, observable } from 'mobx';
import { AppStore } from '.';
import { searchSubgraphs } from '../algorithms/subgraph-search';

export class PatternStore {
    @observable subgraphs: any[] = [];
    @observable searchedSubgraphs: any[] | null = null;
    @observable searchTolerance = 0;
    @observable selectedPatternId: number | null = null;
    @observable selectedPatternNodes: Set<string> | null = null;
    @observable hoveredPattern: number | null = null;

    constructor(private parent: AppStore) {}

    @action.bound
    setSearchTolerance(val: number) {
        this.searchTolerance = val;
    }

    @action.bound
    setSearchedSubgraphs(val: any[] | null) {
        this.searchedSubgraphs = val;
    }

    @action.bound
    selectPattern(p: any) {
        if (p === null) {
            this.selectedPatternId = null;
            this.selectedPatternNodes = null;
        } else {
            this.selectedPatternId = p.index;
            this.selectedPatternNodes = new Set(p.nodes.map((d: any) => d.label));
        }
    }

    @action.bound public setPatternHover(val: number | null) {
        this.hoveredPattern = val;
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
}
