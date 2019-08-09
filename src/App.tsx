import React from 'react';
import './App.css';

import { observer } from 'mobx-react';
import { Layout, Select, Row, Col, Button } from 'antd';

import PatternList from './components/PatternList';

import Scatter from './components/Scatter';

import { store } from './DataStore';
import PatternDiagram from './components/PatternDiagram';
import { getViewboxOfOne } from './algorithms/viewbox';

import ContourContainer from './components/ContourContainer';
import ControlPanel from './components/ControlPanel';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

// const bg = '#f0f2f5';
const bg = '#eaedf7';

const styles = {
  headers: {
    background: '#1864ab',
    height: 54
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
    left: 0
  } as React.CSSProperties,
  middleFrontView: {
    display: 'inline-block',
    width: 800,
    height: 800,
    overflow: 'visible',
    position: 'relative',
    top: -790,
    zIndex: 999
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
    height: window.innerHeight - 60
  },
};

const diagramNodeStyle = {
  normal: '#f4a460',
  highlighted: '#ff4500'
};

const App: React.FC = observer(() => {
  const onSelectChange = (value: string) => {
    store.setDataSource(value);
  };

  const nodeColor = (d: any) => {
    if (store.selectedPatternNodes !== null) {
      return store.selectedPatternNodes.has(d.label) ?
        diagramNodeStyle.highlighted
        :
        diagramNodeStyle.normal;
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
    <div className="App">
      <Header style={styles.headers}>
        <Row gutter={16}>
          <Col span={3}>
            <Select defaultValue='eucore' style={{ width: 180 }} onSelect={onSelectChange}>
              <Option value='eucore'>Eu core</Option>
              <Option value='citeseer'>Citeseer</Option>
            </Select>
          </Col>
          <Col span={1}>
            <Button type='primary' onClick={store.loadData}>Load</Button>
          </Col>
        </Row>
      </Header>
      <Content style={styles.content}>
        <Row gutter={16}>
          <Col span={6}>
            <Row>
              <Scatter patterns={store.subgraphs} width={350} height={350}></Scatter>
            </Row>
            <Row style={styles.list}>
              <PatternList patterns={store.subgraphs} width={110} height={110}></PatternList>
            </Row>
          </Col>
          <Col span={15} style={styles.middle}>
            <div style={{ margin: '0' }}>
              <div style={styles.middleBackView}>
                {
                  store.showContour ?
                    <ContourContainer width={800} height={800} />
                    :
                    null
                }
              </div>
              <div style={styles.middleFrontView}>
                {
                  store.showDiagram && store.graphData ?
                    <PatternDiagram pattern={g} showEdge={store.showDiagramEdge} colorMapping={nodeColor} width={800} height={800} radius={10} viewPort={getViewboxOfOne(store.graphData)} />
                    :
                    null
                }
              </div>
            </div>
          </Col>
          <Col span={3} style={styles.right}>
            <ControlPanel></ControlPanel>
          </Col>
        </Row>
      </Content>
    </div>
  );
});

export default App;
