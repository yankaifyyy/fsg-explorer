import React, { CSSProperties } from 'react';

import Theme from '../themes';

interface IProps {
    title: string;
    children: React.ReactNode;
}

const Panel: React.SFC<IProps> = (props: IProps) => {
    const { title, children } = props;

    const { styles } = Theme;

    const hrSty = {
        color: '#fff',
        boxShadow: '#ccc 0 1px 5px',
    };

    return (
        <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{title}</h2>
            <hr style={hrSty} />
            {children}
        </div>
    );
};

export default Panel;
