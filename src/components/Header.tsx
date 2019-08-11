import React from 'react';
import { observer } from 'mobx-react';

import { store } from '../DataStore';

import { Row, Col, Button, Select } from 'antd';

const { Option } = Select;

const Header: React.FC = () => {
    const onSelectChange = (value: string) => {
        store.setDataSource(value);
    };

    return (
        <Row gutter={16}>
            <Col span={3}>
                <Select defaultValue="eucore" style={{ width: 180 }} onSelect={onSelectChange}>
                    <Option value="eucore">Eu core</Option>
                    <Option value="citeseer">Citeseer</Option>
                </Select>
            </Col>
            <Col span={1}>
                <Button type="primary" onClick={store.loadData}>
                    Load
                </Button>
            </Col>
        </Row>
    );
};

export default observer(Header);
