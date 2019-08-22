import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/alg/';

interface INode {
    index: number;
    label: string;
}

interface IEdge {
    index: number;
    source: INode;
    target: INode;
}

interface IGraph {
    nodes: INode[];
    links: IEdge[];
}

function transform(graph: IGraph) {
    return {
        ...graph,
        links: graph.links.map((e) => ({
            source: e.source.index,
            target: e.target.index,
        })),
    };
}

export async function searchSubgraphs(graph: IGraph, subgraph: IGraph, tolerance: number) {
    console.time('search subgraph via server');

    await axios
        .post(`${BASE_URL}/search_subgraph`, {
            graph: transform(graph),
            subgraph: transform(subgraph),
            tolerance,
        })
        .then((d) => {
            console.log(d.data);
        });
    console.timeEnd('search subgraph via server');

    return 0;
}
