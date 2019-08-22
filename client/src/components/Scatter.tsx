import { observer } from 'mobx-react';
import React from 'react';

import { getViewboxOfOne } from '../algorithms/viewbox';
import { useStore } from '../context';

interface IProps {
    patterns: any;

    width?: number;
    height?: number;
}

const Scatter: React.SFC<IProps> = observer((props) => {
    const store = useStore();

    const { patterns, width = 400, height = 400 } = props;

    const style = {
        border: 'silver 1px solid',
        background: 'white',
    };

    const match = (pattern: { nodes: Array<{ label: string }> }) => {
        const sset = store.patternStore.selectedPatternNodes;
        if (!sset) {
            return false;
        }

        const tset = new Set(pattern.nodes.map((d) => d.label));
        let v = 0;
        const slst = Array.from(sset);
        for (const s of slst) {
            if (tset.has(s)) {
                ++v;
            }
        }

        return v === sset.size && v === tset.size;
    };

    if (patterns) {
        const points = patterns.map((p: any) => ({ x: p.coords[0], y: p.coords[1] }));
        const vbox = getViewboxOfOne({ nodes: points }, 0.5);

        const onHover = (p: any) => {
            store.patternStore.setPatternHover(p.index);
        };

        const onUnHover = () => {
            store.patternStore.setPatternHover(null);
        };

        const onClick = (p: any) => {
            if (match(p)) {
                store.patternStore.selectPattern(null);
            } else {
                store.patternStore.selectPattern(p);
            }
        };

        const f0 = '#0094c8';
        const f2 = '#d9a62e';
        const f3 = '#96514d';

        const elems = points.map((p: any, i: number) => {
            const matched = match(patterns[i]);

            return (
                <circle
                    key={p.index}
                    cx={p.x}
                    cy={p.y}
                    r={0.15}
                    stroke={f3}
                    strokeWidth={i === store.patternStore.hoveredPattern ? 0.05 : 0}
                    fill={matched ? f0 : f2}
                    onMouseEnter={() => onHover(patterns[i])}
                    onMouseLeave={onUnHover}
                    onClick={() => onClick(patterns[i])}
                />
            );
        });

        return (
            <svg style={style} width={width} height={height} viewBox={vbox.join(' ')}>
                <g>{elems}</g>
            </svg>
        );
    }

    return <svg style={style} />;
});

export default Scatter;
