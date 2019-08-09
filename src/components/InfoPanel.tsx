import * as React from 'react';
import { Slider, Switch, Row, Col, Icon, Button } from 'antd';
import { observer } from 'mobx-react';
import { store } from '../DataStore';

import PatternDiagram from './PatternDiagram';
import { searchSubgraphs } from '../algorithms/subgraph-search';

const InfoPanel: React.SFC<{}> = observer(() => {

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
        info = (
            <PatternDiagram background='#fff' pattern={p} showLabel={true} showEdge={true} width={90} height={90} viewPort={p.viewBox} />
        );

        return (
            <div>
                <Row>
                    <Col span={16}>
                        {info}
                    </Col>
                    <Col span={4}>
                        <span>{(store.searchedSubgraphs as any).length}</span>
                    </Col>
                    <Button shape='circle' icon='reload' onClick={onReloadSearch}>
                    </Button>
                </Row>
            </div>
        );
    }

    return (
        <div>
        </div>
    );
});

export default InfoPanel;
