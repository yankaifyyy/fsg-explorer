import React from 'react';
import { observer } from 'mobx-react';

import { store } from '../DataStore';
import { getViewboxOfOne } from '../algorithms/viewbox';

import * as d3 from 'd3';
import { searchSubgraphs } from '../algorithms/subgraph-search';

const match = (pattern: { nodes: Array<{ label: string }> }) => {
    const sset = store.selectedPatternNodes;
    if (!sset) {
        return false;
    }

    const tset = new Set(pattern.nodes.map(d => d.label));
    let v = 0;
    const slst = Array.from(sset);
    for (let s of slst) {
        if (tset.has(s)) {
            ++v;
        }
    }

    return (v === sset.size && v === tset.size);
}

interface IProps {
    patterns: any;

    width?: number;
    height?: number;
}

const Scatter: React.SFC<IProps> = observer((props) => {
    const {
        patterns,
        width = 400,
        height = 400
    } = props;

    const style = {
        border: 'silver 1px solid',
        background: 'white'
    };

    if (patterns) {
        const xsc = d3.scaleLinear()

        const points = patterns.map((p: any) => ({ x: (p.coords[0]), y: (p.coords[1]) }));
        const vbox = getViewboxOfOne({ nodes: points }, .5);

        const onHover = (p: any) => {
            store.setPatternHover(p.index);
        };

        const onUnHover = () => {
            store.setPatternHover(null);
        };

        const onClick = (p: any) => {
            if (match(p)) {
                store.selectPattern(null);
            } else {
                store.selectPattern(p);
            }

            const searched = searchSubgraphs({ nodes: store.graphData.nodes, links: store.graphEdgeArrayCopy }, p, store.searchTolerance);
            store.setSearchedSubraphs(searched);
        }

        const f0 = '#0094c8';
        const f2 = '#d9a62e';
        const f3 = '#96514d';

        const elems = points.map((p: any, i: number) => {
            const matched = match(patterns[i]);

            return <circle cx={p.x} cy={p.y} r={.15} stroke={f3} strokeWidth={i === store.hoveredPattern ? .05 : 0} fill={matched ? f0 : f2} onMouseEnter={() => onHover(patterns[i])} onMouseLeave={onUnHover} onClick={() => onClick(patterns[i])} />;
        });

        return (<svg style={style} width={width} height={height} viewBox={vbox.join(' ')}><g>{elems}</g></svg>);
    }

    return (<svg style={style}></svg>);
});

export default Scatter;
