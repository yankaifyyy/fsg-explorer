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

export function searchSubgraphs(graph: IGraph, subgraph: IGraph, tolerance: number = 0) {
    console.time('search subgraph');

    const lcnt: any = {};
    subgraph.nodes.forEach((d) => {
        if (!lcnt[d.label]) {
            lcnt[d.label] = 1;
        } else {
            lcnt[d.label] += 1;
        }
    });

    const selectedNodes = graph.nodes.filter((d) => lcnt[d.label]);

    const nodeSet = new Set(selectedNodes.map((d) => d.index));

    const selectedEdges = graph.links.filter((d) => nodeSet.has(d.source.index) && nodeSet.has(d.target.index));

    console.time('dfs');
    const seqs: any[] = [];
    let visited: any = {};
    let got: any = {};
    const dfs = (d: INode, s: any[] = []) => {
        if (!got[d.label]) {
            got[d.label] = 0;
        }
        if (got[d.label] >= (lcnt[d.label] || 0)) {
            return false;
        }
        got[d.label] += 1;
        visited[d.index] = true;
        s.push(d.index);

        if (s.length === subgraph.nodes.length) {
            seqs.push(s.slice(0));
            s.pop();
            got[d.label] -= 1;
            return true;
        }

        for (const e of selectedEdges) {
            if (e.source.index === d.index) {
                if (!visited[e.target.index]) {
                    dfs(e.target, s);
                }
            } else if (e.target.index === d.index) {
                if (!visited[e.source.index]) {
                    dfs(e.source, s);
                }
            }
        }

        s.pop();
        got[d.label] -= 1;
        return true;
    };

    for (const d of selectedNodes) {
        visited = [];
        got = {};
        dfs(d, []);
    }

    console.timeEnd('dfs');
    const subgs = seqs.map((seq) => {
        return seq.map((d: any) => graph.nodes[d]);
    });

    const searchedNodes: any[] = [];

    const eFinger = (e: any) => {
        if (e.source.label < e.target.label) {
            return `l_${e.source.label}$${e.target.label}`;
        } else {
            return `l_${e.target.label}$${e.source.label}`;
        }
    };

    const patternFinger = subgraph.links.map(eFinger);
    const ecnt: any = {};

    for (const pe of patternFinger) {
        if (!ecnt[pe]) {
            ecnt[pe] = 1;
        } else {
            ecnt[pe] += 1;
        }
    }

    const calc = (s1: any, s2: any) => {
        let res = 0;
        for (const x in s1) {
            const v = s2[x] || 0;
            res += Math.max(s1[x] - v, 0);
        }
        return res;
    };

    subgs.forEach((nds) => {
        const st = new Set(nds.map((d: any) => d.index));
        const es = selectedEdges.filter((e) => st.has(e.source.index) && st.has(e.target.index));

        const secnt: any = {};
        es.forEach((e) => {
            const ef = eFinger(e);
            secnt[ef] = (secnt[ef] || 0) + 1;
        });

        const score = calc(ecnt, secnt);

        if (!(score > subgraph.links.length * tolerance)) {
            searchedNodes.push(nds.slice());
        }
    });

    console.timeEnd('search subgraph');

    return searchedNodes;

    // for (let i = 0; i < selectedNodes.length; ++i) {
    //     for (let i = 0; i < )
    // }
}
