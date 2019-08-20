import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from '../context';

import Diagram from './PatternDiagram';

export interface IProps {
    patterns: any[];

    width?: number;
    height?: number;
}

const PatternList: React.SFC<IProps> = props => {
    const store = useStore();

    const { patterns, width = 100, height = 100 } = props;

    const match = React.useCallback(
        (pattern: { nodes: Array<{ label: string }> }) => {
            const sset = store.patternStore.selectedPatternNodes;
            if (!sset) {
                return false;
            }

            const tset = new Set(pattern.nodes.map(d => d.label));
            let v = 0;
            const slst = Array.from(sset);
            for (const s of slst) {
                if (tset.has(s)) {
                    ++v;
                }
            }

            return v === sset.size && v === tset.size;
        },
        [store.patternStore.selectedPatternNodes],
    );

    let graphContent = <div />;

    if (patterns) {
        const sw = Math.min(width, height);
        const sh = sw;

        const style: any = {
            display: 'inline-block',
            border: '#5a5a5a 1px solid',
            margin: 5,
            padding: 1,
        };

        const onClickPattern = (p: any) => {
            if (match(p)) {
                store.patternStore.selectPattern(null);
            } else {
                store.patternStore.selectPattern(p);
            }
        };

        const onHoverPattern = (p: any) => {
            store.patternStore.setPatternHover(p.index);
        };
        const onUnHoverPattern = () => {
            store.patternStore.setPatternHover(null);
        };

        const pts = patterns.map((p, i) => {
            let theStyle = style;

            if (store.patternStore.selectedPatternNodes) {
                if (match(p)) {
                    theStyle = {
                        display: 'inline-block',
                        background: '#a0d8ef',
                        border: '#5a5a5a 1px solid',
                        margin: 5,
                        padding: 1,
                    };
                }
            }

            if (p.index === store.patternStore.hoveredPattern) {
                theStyle = {
                    ...theStyle,
                    border: '#96514d 1px solid',
                    boxShadow: '#ccc 0px 0px 3px',
                };
            }

            return (
                <div style={theStyle} onClick={() => onClickPattern(p)} onMouseEnter={() => onHoverPattern(p)} onMouseLeave={onUnHoverPattern}>
                    <Diagram pattern={p} showLabel={true} showEdge={true} width={sw} height={sh} viewPort={p.viewBox} />
                </div>
            );
        });

        graphContent = <div>{pts}</div>;
    }

    return <div>{graphContent}</div>;
};

export default observer(PatternList);
