function C (a, b, c) {
    a[c] = (a[c] || []).concat (b);
    return a;
}

function B (a, b, c) {
    return b.reduce (C, a);
}

function TransposeMatrix(ary) {
    return ary.reduce (B, []);
}

export {TransposeMatrix};