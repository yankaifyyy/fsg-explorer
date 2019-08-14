import { observer, Observer } from 'mobx-react';
import React from 'react';

import { useStore } from '../context';

import { Button, Col, Row, Select } from 'antd';

const { Option } = Select;

const Header: React.FC = () => {
    const store = useStore();

    const onSelectChange = React.useCallback((value: string) => {
        store.setDataSource(value);
    }, []);

    const onLoadClick = React.useCallback(() => {
        store.loadData();
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
