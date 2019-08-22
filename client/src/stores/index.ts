import { action, computed, observable } from 'mobx';
import * as detail from './detail';
import * as diagram from './diagram';
import * as patterns from './patterns';

import { makeTheme } from '../themes';

export class AppStore {
    @observable public graphData: any = null;

    @observable public diagramStore = new diagram.DiagramStore(this);
    @observable public patternStore = new patterns.PatternStore(this);
    @observable public detailStore = new detail.DetailStore(this);

    @observable public theme = makeTheme();

    public graphEdgeArrayCopy: any = [];

    @action.bound public async setData(data) {
        this.graphEdgeArrayCopy = data.graph.links.map((e: any) => ({
            ...e,
            source: data.graph.nodes[e.source],
            target: data.graph.nodes[e.target],
        }));
        this.graphData = data.graph;
        this.patternStore.subgraphs = data.subgs;
    }

    @computed get nodeColorMapper() {
        // if (this.diagramStore.filterOutMode === 0) {
        //     const mapper = (d: any) => {
        //         const spn = this.patternStore.selectedPatternNodes;
        //         if (spn !== null) {
        //             return spn.has(d.label) ? this.theme.diagramNodeStyle.highlighted : this.theme.diagramNodeStyle.normal;
        //         } else {
        //             return this.theme.diagramNodeStyle.normal;
        //         }
        //     };

        //     return mapper;
        // } else {
        const st = this.detailStore.hitNodeLabels;
        const mapper = (d: any) => {
            return st.has(d.label) ? this.theme.diagramNodeStyle.highlighted : this.theme.diagramNodeStyle.normal;
        };

        return mapper;
        // }
    }
}

export const createStore = () => new AppStore();
export type TStore = ReturnType<typeof createStore>;
