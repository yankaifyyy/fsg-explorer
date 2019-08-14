import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from '../context';

import _ from 'lodash';
import { searchSubgraphs } from '../algorithms/subgraph-search';
import Diagram from './PatternDiagram';

export interface IProps {
    patterns: any[];

    width?: number;
    height?: number;
}

const PatternList: React.SFC<IProps> = (props) => {
    const store = useStore();
    const { patterns, width = 100, height = 100 } = props;

    const match = React.useCallback((pattern: { nodes: Array<{ label: string }> }) => {
        const sset = store.selectedPatternNodes;
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
    }, []);

    let graphContent = <div />;

    if (patterns) {
        const sw = width;
        const sh = sw;

        const style: any = {
            display: 'inline-block',
            border: '#5a5a5a 1px solid',
            margin: '10px',
        };

        const onClickPattern = (p: any) => {
            if (match(p)) {
                store.selectPattern(null);
            } else {
                store.selectPattern(p);
            }

            const searched = searchSubgraphs({ nodes: store.graphData.nodes, links: store.graphEdgeArrayCopy }, p, store.searchTolerance);
            store.setSearchedSubraphs(searched);
            // console.log(searched);
        };

        const onHoverPattern = (p: any) => {
            store.setPatternHover(p.index);
        };
        const onUnHoverPattern = () => {
            store.setPatternHover(null);
        };

        const pts = patterns.map((p, i) => {
            let theStyle = style;

            if (store.selectedPatternNodes) {
                if (match(p)) {
                    theStyle = {
                        display: 'inline-block',
                        background: '#a0d8ef',
                        // border: '#905690 2px solid',
                        margin: '10px',
                    };
                }
            }

            if (p.index === store.hoveredPattern) {
                theStyle = {
                    ...theStyle,
                    border: '#96514d 2px solid',
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
