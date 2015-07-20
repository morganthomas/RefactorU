var colorutil = require('./colorutil.js');

var r = parseFloat(process.argv[2]);
var g = parseFloat(process.argv[3]);
var b = parseFloat(process.argv[4]);

console.log(colorutil.luminosity(r,g,b));
