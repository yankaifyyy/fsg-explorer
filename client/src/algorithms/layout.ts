import * as d3 from 'd3';
import * as _ from 'lodash';

export function doLayout(g: any, iters = 50) {
    g.nodes = _.map(g.features, (d: any, i: any) => {
        return {
            index: i,
            label: d,
        };
    });

    g.links = g.edges.map((e: any, i: number) => ({ index: i, source: e[0], target: e[1] }));

    const sim = d3
        .forceSimulation(g.nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(g.links))
        .force('center', d3.forceCenter())
        .stop();

    for (let i = 0; i < iters; ++i) {
        sim.tick();
    }

    return g;
}
