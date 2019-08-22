import { observer } from 'mobx-react';
import React from 'react';

import { useStore } from '../context';

import { Button, Col, Row, Select } from 'antd';
import { processGraph } from '../algorithms/pre-process';
import { getGraph, getGraphList } from '../local-server-api';

const { Option } = Select;

const Header: React.FC = observer(() => {
    const store = useStore();

    const [sourceList, setSourceList] = React.useState<string[]>([]);
    const [dataSource, setDataSource] = React.useState();

    React.useEffect(() => {
        getGraphList().then((d) => {
            setSourceList(d);
            if (d.length > 0) {
                setDataSource(d[0]);
            }
        });
    }, []);

    const loadData = React.useCallback(() => {
        getGraph(dataSource).then((d) => {
            store.setData(processGraph(d));
        });
    }, [dataSource, store.setData]);

    const options = sourceList.map((d) => (
        <Option key={d} value={d}>
            {d}
        </Option>
    ));

    return (
        <Row gutter={16}>
            <Col span={3}>
                <Select style={{ width: 180 }} value={dataSource} onSelect={setDataSource}>
                    {options}
                </Select>
            </Col>
            <Col span={1}>
                <Button type='primary' onClick={loadData}>
                    Load
                </Button>
            </Col>
        </Row>
    );
});

export default Header;
