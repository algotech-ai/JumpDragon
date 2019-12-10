// Extracted from JavaScript The Good Part
Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};
// value必须在min和max之间，否则返回min
Math.clamp = function(value, min, max) {
      value = value > max ? max : value;
      value = value < min ? min : value;
      return value;
};
