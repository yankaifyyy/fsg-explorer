import { toJS } from 'mobx';
import React from 'react';

import { Layout } from 'antd';
import { observer } from 'mobx-react';

import PatternList from '../components/PatternList';

import Scatter from '../components/Scatter';

import AppHeader from '../components/AppHeader';
import ControlPanel from '../components/ControlPanel';
import DetailView from '../views/DetailView';
import DiagramView from '../views/DiagramView';

import Panel from '../components/Panel';

import { useStore } from '../context';

const { Header, Content } = Layout;

const Visualization: React.SFC<{}> = observer(() => {
    const store = useStore();

    return (
        <div className='App'>
            <Header style={toJS(store.theme.styles.headers)}>
                <AppHeader />
            </Header>
            <Content style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                <Panel title='Diagram view' theme={store.theme}>
                    <DiagramView width={750} height={750} />
                </Panel>
                <Panel title='Patterns' theme={store.theme}>
                    <div style={{ width: 380, height: 750, overflow: 'auto' }}>
                        <PatternList patterns={store.patternStore.subgraphs} width={90} height={90} />
                    </div>
                </Panel>
                <Panel title='Pattern Relations' theme={store.theme}>
                    <Scatter patterns={store.patternStore.subgraphs} width={350} height={350} />
                </Panel>
                <Panel title='Detail' theme={store.theme}>
                    <DetailView width={350} height={280} />
                </Panel>
                <Panel title='Settings' theme={store.theme}>
                    <div style={{ width: 240 }}>
                        <ControlPanel />
                    </div>
                </Panel>
            </Content>
        </div>
    );
});

export default Visualization;
