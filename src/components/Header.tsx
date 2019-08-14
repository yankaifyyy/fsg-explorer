import { observer, Observer } from 'mobx-react';
import React from 'react';

import { useStore } from '../context';
import { store } from '../DataStore';

import { Button, Col, Row, Select } from 'antd';

const { Option } = Select;

const Header: React.FC = () => {
    const sst = useStore();

    const onSelectChange = React.useCallback((value: string) => {
        store.setDataSource(value);
        sst.setDataSource(value);
    }, []);

    const onLoadClick = React.useCallback(() => {
        store.loadData();
        sst.loadData();
    }, []);

    return (
        <Observer>
            {() => (
                <Row gutter={16}>
                    <Col span={3}>
                        <Select defaultValue='eucore' style={{ width: 180 }} onSelect={onSelectChange}>
                            <Option value='eucore'>Eu core</Option>
                            <Option value='citeseer'>Citeseer</Option>
                        </Select>
                    </Col>
                    <Col span={1}>
                        <Button type='primary' onClick={onLoadClick}>
                            Load
                        </Button>
                    </Col>
                </Row>
            )}
        </Observer>
    );
};

export default Header;
