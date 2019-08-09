// declare module 'numeric' {
//     type Matrix = number[][];

//     interface SVD {
//         U: Matrix;
//         S: number[];
//         V: Matrix;
//     }

//     function add<T1, T2>(mat1: T1, mat2: T2): T1;
//     function mul<T1, T2>(mat: T1, factor: T2): T1;
//     function div<T1, T2>(mat: T1, divisor: T2): T1;
//     function pow<T1, T2>(mat: T1, exp: T2): T1;
//     function sqrt<T>(mat: T): T;
//     function transpose(mat: Matrix): Matrix;
//     function svd(mat: Matrix): SVD;

//     export default {
//         add, mul, div, pow,
//         sqrt, transpose,
//         svd
//     };
// }