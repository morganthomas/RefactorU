function luminosity(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

console.log(luminosity(
  parseFloat(process.argv[2]),
  parseFloat(process.argv[3]),
  parseFloat(process.argv[4])
));
