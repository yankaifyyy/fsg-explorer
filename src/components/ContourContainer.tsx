import { useStore } from '../context';
import Contour from './Contour';

import { observer } from 'mobx-react';
import React from 'react';

import { getViewboxOfOne } from '../algorithms/viewbox';
import { IDot } from '../models/contour';

const levels = [
    {
        frac: 0,
        color: [0.57, 0.8, 0.93, 0.5],
    },
    {
        frac: 0.25,
        color: [0.57, 0.8, 0.93, 0.75],
    },
    {
        frac: 0.4,
        color: [0.33, 0.66, 1.0, 0.75],
    },
    {
        frac: 0.55,
        color: [0.22, 0.55, 1.0, 0.8],
    },
    {
        frac: 0.7,
        color: [0.17, 0.44, 0.78, 0.85],
    },
    {
        frac: 0.95,
        color: [0.14, 0.29, 0.61, 0.85],
    },
    {
        frac: 0.99,
        color: [0.12, 0.24, 0.47, 0.9],
    },
];
interface IProps {
    width: number;
    height: number;
}

const ContourContainer: React.SFC<IProps> = (props: IProps) => {
    const store = useStore();
    const { width, height } = props;

    const data = store.graphData;
    const dots: IDot[] = [];

    const param = {
        levels,
        kernelRadius: store.contour.kernelRadius,
    };

    if (data) {
        data.nodes.forEach((d: any) => {
            if (!store.selectedPatternNodes || store.selectedPatternNodes.has(d.label)) {
                dots.push({
                    x: d.x,
                    y: d.y,
                    intensity: 1,
                });
            }
        });

        const vbox = getViewboxOfOne(store.graphData);
        return <Contour data={dots} param={param} width={width} height={height} vbox={vbox} />;
    } else {
        return <Contour data={[]} param={param} width={width} height={height} vbox={[0, 1, 0, 1]} />;
    }
};

export default observer(ContourContainer);
