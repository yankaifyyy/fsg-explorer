export async function getGraphData(graphName: string) {
    const graph = await fetch(`data/${graphName}/graph.json`).then((res) => res.json());

    const features = await fetch(`data/${graphName}/features.csv`)
        .then((res) => res.text())
        .then((res) => {
            const lines = res.trim().split('\n');
            const fs: any[] = [];
            for (let i = 1; i < lines.length; ++i) {
                const fea = lines[i]
                    .split(',')
                    .slice(1)
                    .map((v) => +v);
                fs.push(fea);
            }
            return fs;
        });

    const { params: param, subgs: subgraphs } = await fetch(`data/${graphName}/desc.txt`)
        .then((res) => res.text())
        .then(async (res) => {
            const params: any = {};
            res.split('\n').forEach((l) => {
                const p = l.split(':');
                params[p[0]] = p[1];
            });

            const subgs: any[] = [];
            if (params.subgraphs !== undefined) {
                for (let i = 0; i < +params.subgraphs; ++i) {
                    const subg = await fetch(`data/${graphName}/${i}.json`).then((r) => r.json());
                    subgs.push(subg);
                }
            }

            return {
                params,
                subgs,
            };
        });

    return {
        graph,
        features,
        param,
        subgraphs,
    };
}
