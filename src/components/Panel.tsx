import { toJS } from 'mobx';
import React, { CSSProperties } from 'react';

interface IProps {
    title: string;
    children: React.ReactNode;
    theme: any;
}

const Panel: React.SFC<IProps> = (props: IProps) => {
    const { title, children } = props;

    const { styles } = props.theme;

    const hrSty = {
        color: '#fff',
        boxShadow: '#ccc 0 1px 5px',
    };

    const sty = {
        width: 'fit-content',
        height: 'fit-content',
        ...styles.panel,
    };

    return (
        <div style={sty}>
            <h2 style={toJS(styles.panelTitle)}>{title}</h2>
            <hr style={hrSty} />
            {children}
        </div>
    );
};

export default Panel;
