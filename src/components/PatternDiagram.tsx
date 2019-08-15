import { observer } from 'mobx-react';
import React from 'react';

export interface IProps {
    pattern?: any;

    width?: number;
    height?: number;

    radius?: number;

    showLabel?: boolean;

    showEdge?: boolean;

    colorMapping?: string | ((d: any) => string);

    background?: string;

    viewPort: [number, number, number, number];
}

const PatternDiagram: React.SFC<IProps> = ({ pattern, showLabel, showEdge, width, height, viewPort, background, colorMapping, radius = 5 }) => {
    let graphContent = <g />;

    if (pattern) {
        const fill = colorMapping === undefined ? 'orange' : colorMapping;

        const getFill = (d: any) => {
            if (typeof fill === 'string') {
                return fill;
            } else {
                return fill(d);
            }
        };

        const nodeElements = pattern.nodes.map((d: any) => {
            return <circle key={`n${d.index}`} cx={d.x} cy={d.y} r={radius} fill={getFill(d)} />;
        });

        const nodeGroup = <g className='nodes'>{nodeElements}</g>;

        let labelGroup: any = null;
        if (showLabel) {
            const labelElements = pattern.nodes.map((d: any) => {
                return (
                    <text key={`l${d.index}`} x={d.x} y={d.y}>
                        {d.label}
                    </text>
                );
            });

            labelGroup = <g className='labels'>{labelElements}</g>;
        }

        let edgeGroup: any = null;
        if (showEdge) {
            const edgeElements = pattern.links.map((e: any) => {
                const u = e.source;
                const v = e.target;

                return <line key={`e${e.index}`} x1={u.x} y1={u.y} x2={v.x} y2={v.y} strokeWidth={0.3} stroke={'darkgrey'} strokeOpacity={0.9} />;
            });

            edgeGroup = <g className='edges'>{edgeElements}</g>;
        }

        graphContent = (
            <g className='content'>
                {edgeGroup}
                {nodeGroup}
                {labelGroup}
            </g>
        );
    }

    const viewBox = viewPort.join(' ');
    const sty: any = {
        display: 'inline-block',
        margin: '0 auto',
        width: `${width}px`,
        height: `${height}px`,
    };

    if (background !== undefined) {
        sty.background = background;
    }

    return (
        <svg style={sty} viewBox={viewBox}>
            {graphContent}
        </svg>
    );
};

export default observer(PatternDiagram);
