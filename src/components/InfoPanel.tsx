import { Button, Col, Icon, Row, Slider, Switch } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from '../context';

import { searchSubgraphs } from '../algorithms/subgraph-search';
import PatternDiagram from './PatternDiagram';

const InfoPanel: React.SFC<{}> = observer(() => {
    const store = useStore();

    let info: any = null;

    const onReloadSearch = () => {
        if (store.selectedPatternId !== null) {
            const p = store.subgraphs[store.selectedPatternId];
            const searched = searchSubgraphs({ nodes: store.graphData.nodes, links: store.graphEdgeArrayCopy }, p, store.searchTolerance);
            store.setSearchedSubraphs(searched);
        }
    };

    if (store.selectedPatternId !== null) {
        const p = store.subgraphs[store.selectedPatternId];
        info = <PatternDiagram background="#fff" pattern={p} showLabel={true} showEdge={true} width={90} height={90} viewPort={p.viewBox} />;

        return (
            <div>
                <Row>
                    <Col span={16}>{info}</Col>
                    <Col span={4}>
                        <span>{(store.searchedSubgraphs as any).length}</span>
                    </Col>
                    <Button shape="circle" icon="reload" onClick={onReloadSearch} />
                </Row>
            </div>
        );
    }

    return <div />;
});

export default InfoPanel;
