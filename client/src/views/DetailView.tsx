import { observer } from 'mobx-react';
import React from 'react';

import PatternDetailDiagram from '../components/PatternDetailDiagram';
import { useStore } from '../context';

interface IProps {
    width?: number;
    height?: number;
}

const DetailView: React.SFC<IProps> = observer((props: IProps) => {
    const store = useStore();

    const { width = 500, height = 500 } = props;

    const nodeColor = store.nodeColorMapper;

    const onClick = React.useCallback(
        (d: any) => {
            if (store.detailStore.selectedNodes === d) {
                store.detailStore.setSelectedNodes([]);
            } else {
                store.detailStore.setSelectedNodes([d]);
            }
        },
        [store],
    );

    const sty = {
        display: 'flex',
        flexDirection: 'column',
    } as any;

    return (
        <div style={sty}>
            <label>Similar subgraphs: {store.detailStore.hits}</label>
            {store.detailStore.pattern ? (
                <PatternDetailDiagram
                    pattern={store.detailStore.pattern}
                    showLabel={true}
                    showEdge={true}
                    width={width}
                    height={height}
                    colorMapping={nodeColor}
                    onClickNode={onClick}
                    viewPort={store.detailStore.pattern.viewBox}
                />
            ) : (
                <svg width={width} height={height} />
            )}
        </div>
    );
});

export default DetailView;
