import { Col, Radio, Row, Slider, Switch } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from '../context';

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
    const { diagramStore, patternStore, graphData } = useStore();

    const onChangeKernelValue = (e: any) => {
        diagramStore.setContourRadius(e);
    };

    const onChangeTolerance = (e: any) => {
        patternStore.setSearchTolerance(e);
    };

    const onChangeFilterMode = (e: any) => {
        diagramStore.setFilterOutMode(e.target.value);
    };

    return (
        <div>
            <Row>
                <h2>Graph info:</h2>
                {graphData ? (
                    <div>
                        |V| = {graphData.nodes.length} |E| = {graphData.links.length}
                    </div>
                ) : null}
            </Row>
            <hr />
            <Row>
                <Col span={16}>
                    <label>Diagram: </label>
                </Col>
                <Switch style={styles.switch} checked={diagramStore.showDiagram} checkedChildren='Show' onChange={diagramStore.setShowDiagram} />
            </Row>
            <Row>
                <Col span={16}>
                    <label>Contour: </label>
                </Col>
                <Switch style={styles.switch} checked={diagramStore.showContour} checkedChildren='Show' onChange={diagramStore.setShowContour} />
            </Row>
            <Row>
                <Col span={16}>
                    <label>Edges in diagram: </label>
                </Col>
                <Switch style={styles.switch} checked={diagramStore.showDiagramEdge} checkedChildren='Show' onChange={diagramStore.setShowDiagramEdge} />
            </Row>

            <Row>
                <h3>Filter mode:</h3>

                <Radio.Group onChange={onChangeFilterMode} value={diagramStore.filterOutMode}>
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

            <h3>Parameters:</h3>
            <label> Contour radius: </label>
            <Slider min={0} max={500} value={diagramStore.contour.kernelRadius} onChange={onChangeKernelValue} />

            <label> Search tolerance: </label>
            <Slider min={0} max={1} step={0.05} value={patternStore.searchTolerance} onChange={onChangeTolerance} />
        </div>
    );
});

export default ControlPanel;
