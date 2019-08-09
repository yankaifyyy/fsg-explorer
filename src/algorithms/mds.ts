// Implementation: http://www.benfrederickson.com/multidimensional-scaling/
import numeric from 'numeric';

function sqrEuDist(v1: number[], v2: number[]) {
    let v = 0;
    for (let i = 0; i < v1.length; ++i) {
        v += (v1[i] - v2[i]) * (v1[i] - v2[i]);
    }

    return v;
}

function euDist(v1: number[], v2: number[]) {
    return Math.sqrt(sqrEuDist(v1, v2));
}

export function distances(mat: any) {
    const res: number[][] = [];
    for (let i = 0; i < mat.length; ++i) {
        res[i] = [];
    }

    for (let i = 0; i < mat.length; ++i) {
        res[i][i] = 0;
        for (let j = i + 1; j < mat.length; ++j) {
            res[i][j] = euDist(mat[i], mat[j]);
            res[j][i] = res[i][j];
        }
    }

    return res;
}

export function mdsOnData(matrix: number[][], dimensions?: number) {
    const dis = distances(matrix);
    return mds(dis, dimensions);
}

export function mds(distances: any, dimensions?: number) {
    dimensions = dimensions || 2;

    if (distances.length === 0) {
        return [];
    } else if (distances.length === 1) {
        return [0.5, 0.5];
    }

    distances = numeric.mul(distances, 100);

    const M = numeric.mul(numeric.pow(distances, 2), -.5);

    const mean = (A: any) => numeric.div(numeric.add.apply(null, A), A.length) as any;
    const rowMeans = mean(M);
    const colMeans = mean(numeric.transpose(M));
    const totalMean = mean(rowMeans);

    for (let i = 0; i < M.length; ++i) {
        for (let j = 0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }

    const ret = numeric.svd(M);
    const eigenValues = numeric.sqrt(ret.S);

    return ret.U.map((row: any) =>
        numeric.mul(row, eigenValues).splice(0, dimensions)
    );
}