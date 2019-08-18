import { action, computed, observable } from 'mobx';
import { AppStore } from '.';

export class DetailStore {
    @observable selectedNodes: any[] = [];

    constructor(private parent: AppStore) {}

    @action.bound
    setSelectedNodes(nodes: any[]) {
        this.selectedNodes = nodes;
    }

    @computed
    get pattern() {
        if (this.parent.patternStore.selectedPatternId === null) {
            return null;
        } else {
            return this.parent.patternStore.subgraphs[this.parent.patternStore.selectedPatternId];
        }
    }

    @computed
    get hits() {
        if (this.parent.patternStore.selectedPatternId === null) {
            return 0;
        } else {
            return (this.parent.patternStore.searchedSubgraphs as any).length;
        }
    }

    @computed
    get hitNodes() {
        const lbSet = new Set(this.selectedNodes.map((d) => d.label));
        return new Set(this.parent.graphData.nodes.filter((d) => lbSet.has(d.label)).map((d) => d.index));
    }

    @computed
    get hitNodeLabels() {
        return new Set(this.selectedNodes.map((d) => d.label));
    }
}
