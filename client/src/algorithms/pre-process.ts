import { doLayout } from './layout';
import { mdsOnData } from './mds';
import { getViewbox } from './viewbox';

export function processGraph(data) {
    const coords2 = mdsOnData(data.features);
    const subgs = data.subgs.map(doLayout);
    const viewbox = getViewbox(subgs);

    subgs.forEach((g: any, i: number) => {
        g.index = i;
        g.viewBox = viewbox;
        g.feature = data.features[i];
        g.coords = coords2[i];
    });

    return data;
}
