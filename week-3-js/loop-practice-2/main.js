var animals = ['rat', 'cat', 'butterfly', 'marmot', 'ocelot'];

console.log("Problem 1");

for (var i = 0; i < animals.length - 1; i++) {
  console.log(animals[i]);
}

console.log("Problem 2");

for (var i = 0; i < animals.length; i += 2) {
  console.log(animals[i]);
}

console.log("Problem 3");

for (var i = animals.length - 1; i >= 0; i--) {
  console.log(animals[i]);
}

console.log("Problem 4");

for (var i = 0; i < animals.length; i++) {
  if (0 < i && i < animals.length - 1) {
    console.log(animals[i]);
  }
  console.log(animals[i]);
}
