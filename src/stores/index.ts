import { action, computed, observable, runInAction } from 'mobx';
import * as diagram from './diagram';
import * as patterns from './patterns';

import doLayout from '../algorithms/doLayout';
import { mdsOnData } from '../algorithms/mds';
import { getViewbox } from '../algorithms/viewbox';

import { getGraphData } from '../local-server-api';

import { makeTheme } from '../themes';

export class AppStore {
    @observable public dataSource: string = 'eucore';
    @observable public graphData: any = null;

    @observable public diagramStore = new diagram.DiagramStore(this);
    @observable public patternStore = new patterns.PatternStore(this);

    @observable public theme = makeTheme();

    public graphEdgeArrayCopy: any = [];

    @action.bound public setDataSource(val: string) {
        this.dataSource = val;
    }

    @action.bound public async loadData() {
        console.log('Loading from ');
        console.log(this.dataSource);

        const data = await getGraphData(this.dataSource);
        const coords2 = mdsOnData(data.features);
        const subgs = data.subgraphs.map(doLayout);
        const viewbox = getViewbox(subgs);
        subgs.forEach((g: any, i: number) => {
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
            this.patternStore.subgraphs = subgs;
        });
    }

    @computed get nodeColorMapper() {
        const mapper = (d: any) => {
            const spn = this.patternStore.selectedPatternNodes;
            if (spn !== null) {
                return spn.has(d.label) ? this.theme.diagramNodeStyle.highlighted : this.theme.diagramNodeStyle.normal;
            } else {
                return this.theme.diagramNodeStyle.normal;
            }
        };

        return mapper;
    }
}

export const createStore = () => new AppStore();
export type TStore = ReturnType<typeof createStore>;
