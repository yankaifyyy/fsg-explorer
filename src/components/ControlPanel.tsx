import { Col, Radio, Row, Slider, Switch } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from '../context';

import InfoPanel from './InfoPanel';

const styles = {
    switch: {
        width: 60,
    },
    radio: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    },
};

const ControlPanel: React.SFC<{}> = observer(() => {
    const store = useStore();

    const onChangeKernelValue = (e: any) => {
        store.setContourRadius(e);
    };

    const onChangeTolerance = (e: any) => {
        store.setSearchTolerance(e);
    };

    const onChangeFilterMode = (e: any) => {
        store.setFilterOutMode(e.target.value);
    };

    return (
        <div>
            <Row>
                <Col span={16}>
                    <label>Diagram: </label>
                </Col>
                <Switch style={styles.switch} checked={store.showDiagram} checkedChildren='Show' onChange={store.setShowDiagram} />
            </Row>
            <Row>
                <Col span={16}>
                    <label>Contour: </label>
                </Col>
                <Switch style={styles.switch} checked={store.showContour} checkedChildren='Show' onChange={store.setShowContour} />
            </Row>
            <Row>
                <Col span={16}>
                    <label>Edges in diagram: </label>
                </Col>
                <Switch style={styles.switch} checked={store.showDiagramEdge} checkedChildren='Show' onChange={store.setShowDiagramEdge} />
            </Row>

            <Row>
                <h3>Filter mode:</h3>

                <Radio.Group onChange={onChangeFilterMode} value={store.filterOutMode}>
                    <Radio style={styles.radio} value={0}>
                        No filter
                    </Radio>
                    <Radio style={styles.radio} value={1}>
                        Filter by common nodes
                    </Radio>
                    <Radio style={styles.radio} value={2}>
                        Filter by pattern
                    </Radio>
                </Radio.Group>
            </Row>
            <hr />

            <h3>Info:</h3>
            <InfoPanel />

            <hr />

            <h3>Parameters:</h3>
            <label> Contour radius: </label>
            <Slider min={0} max={500} value={store.contour.kernelRadius} onChange={onChangeKernelValue} />

            <label> Search tolerance: </label>
            <Slider min={0} max={1} step={0.05} value={store.searchTolerance} onChange={onChangeTolerance} />
        </div>
    );
});

export default ControlPanel;
