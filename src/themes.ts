// const bg = '#f0f2f5';
const bg = '#fff';

const styles = {
    headers: {
        background: bg,
        // height: 54,
        borderBottom: '1px silver solid',
        boxShadow: '#ccc 0px 1px 5px',
    },
    list: {
        overflowY: 'auto',
        maxHeight: window.innerHeight - 80 - 400,
    } as React.CSSProperties,
    left: {
        height: '100%',
        background: bg,
        overflowY: 'auto',
        borderRight: '#ccc 1px solid',
        borderLeft: '#ccc 1px solid',
    } as React.CSSProperties,
    content: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    panel: {
        padding: 10,
        margin: 10,
        boxShadow: '#ccc 0 0 10px',
        borderRadius: 5,
    },
    panelTitle: {
        color: 'steelblue',
        userSelect: 'none',
        textTransform: 'uppercase',
    },
};

const colors = {
    normal: '#f4a460',
    highlighted: '#ff4500',
};

export function makeTheme() {
    return {
        styles,
        diagramNodeStyle: colors,
    };
}
