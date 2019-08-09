interface INode {
    x: number;
    y: number;
}

interface IGraph {
    nodes: INode[];
}

export function getViewboxOfOne(graph: IGraph, off = 2) {
    let minx = Infinity;
    let miny = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;

    graph.nodes.forEach((d) => {
        minx = Math.min(minx, d.x);
        miny = Math.min(miny, d.y);
        maxx = Math.max(maxx, d.x);
        maxy = Math.max(maxy, d.y);
    });

    return [minx - off, miny - off, maxx - minx + 2 * off, maxy - miny + 2 * off] as [number, number, number, number];
}

export function getViewbox(graphs: IGraph[], off = 2) {
    let minx = Infinity;
    let miny = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;

    graphs.forEach(g => {
        g.nodes.forEach((d) => {
            minx = Math.min(minx, d.x);
            miny = Math.min(miny, d.y);
            maxx = Math.max(maxx, d.x);
            maxy = Math.max(maxy, d.y);
        });
    });

    return [minx - off, miny - off, maxx - minx + 2 * off, maxy - miny + 2 * off] as [number, number, number, number];
}
