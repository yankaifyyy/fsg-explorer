import React from 'react';
import './App.css';
import { hot } from 'react-hot-loader/root';

import { observer, Provider } from 'mobx-react';
import { Layout, Select, Row, Col, Button } from 'antd';

import PatternList from './components/PatternList';

import Scatter from './components/Scatter';

import { store } from './DataStore';
import PatternDiagram from './components/PatternDiagram';
import { getViewboxOfOne } from './algorithms/viewbox';

import AppHeader from './components/Header';
import ContourContainer from './components/ContourContainer';
import ControlPanel from './components/ControlPanel';

const { Header, Content } = Layout;

// const bg = '#f0f2f5';
const bg = '#fff';

const styles = {
    headers: {
        background: bg,
        height: 54,
        borderBottom: '1px silver solid',
        boxShadow: 'grey 1px 1px 5px 1px',
    },
    list: {
        overflowY: 'auto',
        maxHeight: window.innerHeight - 80 - 400,
    } as React.CSSProperties,
    left: {
        maxHeight: window.innerHeight - 80,
        background: bg,
        overflowY: 'auto',
        borderRight: '#ccc 1px solid',
        borderLeft: '#ccc 1px solid',
    } as React.CSSProperties,
    middle: {
        maxHeight: window.innerHeight - 80,
        background: bg,
        overflowY: 'auto',
        borderRight: '#ccc 1px solid',
        borderLeft: '#ccc 1px solid',
    } as React.CSSProperties,
    middleBackView: {
        display: 'inline-block',
        width: 800,
        height: 800,
        overflow: 'visible',
        position: 'relative',
        top: 10,
        left: 0,
    } as React.CSSProperties,
    middleFrontView: {
        display: 'inline-block',
        width: 800,
        height: 800,
        overflow: 'visible',
        position: 'relative',
        top: -790,
        zIndex: 999,
    } as React.CSSProperties,
    right: {
        maxHeight: window.innerHeight - 80,
        background: bg,
        overflowY: 'auto',
        borderRight: '#ccc 1px solid',
        borderLeft: '#ccc 1px solid',
    } as React.CSSProperties,
    content: {
        padding: '20px 15px',
        background: bg,
        height: window.innerHeight - 60,
    },
};

const diagramNodeStyle = {
    normal: '#f4a460',
    highlighted: '#ff4500',
};

const App: React.FC = observer(() => {
    const onSelectChange = (value: string) => {
        store.setDataSource(value);
    };

    const nodeColor = (d: any) => {
        if (store.selectedPatternNodes !== null) {
            return store.selectedPatternNodes.has(d.label) ? diagramNodeStyle.highlighted : diagramNodeStyle.normal;
        } else {
            return diagramNodeStyle.normal;
        }
    };

    const g = { nodes: [], links: [] };
    if (store.graphData) {
        g.nodes = store.graphData.nodes;
        g.links = store.graphEdgeArrayCopy;
        if (store.filterOutMode && store.selectedPatternNodes !== null) {
            if (store.filterOutMode === 1 && store.selectedPatternNodes !== null) {
                const st = store.selectedPatternNodes as Set<string>;
                g.nodes = g.nodes.filter((d: any) => st.has(d.label));
                g.links = g.links.filter((e: any) => st.has(e.source.label) && st.has(e.target.label));
            } else if (store.filterOutMode === 2 && store.searchSubgraphNodes !== null) {
                const st = store.searchSubgraphNodes as Set<number>;
                g.nodes = g.nodes.filter((d: any) => st.has(d.index));
                g.links = g.links.filter((e: any) => st.has(e.source.index) && st.has(e.target.index));
            }
        }
    }

    return (
        <Provider {...store}>
            <div className="App">
                <Header style={styles.headers}>
                    <AppHeader />
                </Header>
                <Content style={styles.content}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Row>
                                <Scatter patterns={store.subgraphs} width={350} height={350} />
                            </Row>
                            <Row style={styles.list}>
                                <PatternList patterns={store.subgraphs} width={110} height={110} />
                            </Row>
                        </Col>
                        <Col span={15} style={styles.middle}>
                            <div style={{ margin: '0' }}>
                                <div style={styles.middleBackView}>{store.showContour ? <ContourContainer width={800} height={800} /> : null}</div>
                                <div style={styles.middleFrontView}>
                                    {store.showDiagram && store.graphData ? (
                                        <PatternDiagram
                                            pattern={g}
                                            showEdge={store.showDiagramEdge}
                                            colorMapping={nodeColor}
                                            width={800}
                                            height={800}
                                            radius={10}
                                            viewPort={getViewboxOfOne(store.graphData)}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </Col>
                        <Col span={3} style={styles.right}>
                            <ControlPanel />
                        </Col>
                    </Row>
                </Content>
            </div>
        </Provider>
    );
});

export default (process.env.NODE_ENV === 'development' ? hot(App) : App);
