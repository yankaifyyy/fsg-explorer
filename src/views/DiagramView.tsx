import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ContourContainer from '../components/ContourContainer';

import { getViewboxOfOne } from '../algorithms/viewbox';
import PatternDiagram from '../components/PatternDiagram';
import { useStore } from '../context';
import Theme from '../themes';

const { styles, diagramNodeStyle } = Theme;

interface IProps {
    width?: number;
    height?: number;
}

const DiagramView: React.SFC<IProps> = observer((props: IProps) => {
    const store = useStore();

    const { width = 800, height = 800 } = props;

    const nodeColor = React.useCallback((d: any) => {
        if (store.selectedPatternNodes !== null) {
            return store.selectedPatternNodes.has(d.label) ? diagramNodeStyle.highlighted : diagramNodeStyle.normal;
        } else {
            return diagramNodeStyle.normal;
        }
    }, []);

    const back = {
        width,
        height,
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
    } as CSSProperties;
    const front = {
        width,
        height,
        overflow: 'visible',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
    } as CSSProperties;

    const sty = {
        height,
        width,
        position: 'relative',
        margin: 10,
    } as CSSProperties;

    const g = { nodes: [], links: [] };
    if (store.graphData) {
        g.nodes = store.graphData.nodes;
        g.links = store.graphEdgeArrayCopy;
        if (store.diagramStore.filterOutMode && store.selectedPatternNodes !== null) {
            if (store.diagramStore.filterOutMode === 1 && store.selectedPatternNodes !== null) {
                const st = store.selectedPatternNodes as Set<string>;
                g.nodes = g.nodes.filter((d: any) => st.has(d.label));
                g.links = g.links.filter((e: any) => st.has(e.source.label) && st.has(e.target.label));
            } else if (store.diagramStore.filterOutMode === 2 && store.searchSubgraphNodes !== null) {
                const st = store.searchSubgraphNodes as Set<number>;
                g.nodes = g.nodes.filter((d: any) => st.has(d.index));
                g.links = g.links.filter((e: any) => st.has(e.source.index) && st.has(e.target.index));
            }
        }
    }

    return (
        <div style={sty}>
            <div style={back}>{store.diagramStore.showContour ? <ContourContainer width={width} height={height} /> : null}</div>
            <div style={front}>
                {store.diagramStore.showDiagram && store.graphData ? (
                    <PatternDiagram
                        pattern={g}
                        showEdge={store.diagramStore.showDiagramEdge}
                        colorMapping={nodeColor}
                        width={width}
                        height={height}
                        radius={10}
                        viewPort={getViewboxOfOne(store.graphData)}
                    />
                ) : null}
            </div>
        </div>
    );
});

export default DiagramView;
