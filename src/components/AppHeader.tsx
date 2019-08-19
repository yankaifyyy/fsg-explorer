import { observer } from 'mobx-react';
import React from 'react';

import { useStore } from '../context';

import { Button, Col, Row, Select } from 'antd';

const { Option } = Select;

const Header: React.FC = observer(() => {
    const store = useStore();

    return (
        <Row gutter={16}>
            <Col span={3}>
                <Select defaultValue='eucore' style={{ width: 180 }} onSelect={store.setDataSource}>
                    <Option value='eucore'>Eu core</Option>
                    <Option value='citeseer'>Citeseer</Option>
                    <Option value='aviation'>Aviation</Option>
                </Select>
            </Col>
            <Col span={1}>
                <Button type='primary' onClick={store.loadData}>
                    Load
                </Button>
            </Col>
        </Row>
    );
});

export default Header;
