function luminosity(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

var r = parseFloat(process.argv[2]);
var g = parseFloat(process.argv[3]);
var b = parseFloat(process.argv[4]);
var lum = luminosity(r,g,b);

if (lum >= 155) {
  console.log('light');
} else {
  console.log('dark');
}
