// Outputs a random number between least and most, including least but not most.
var randomInt = function(least, most) {
	return Math.floor(Math.random() * (most - least)) + least;
};

// Get a list of n random numbers in the range [least,most), without repetition.
// Note: will loop forever if n > (most - least).
var randomInts = function(least, most, n) {
	var result = [];

	for (var i = 0; i < n; i++) {
		var x;

		do {
			x = randomInt(least, most);
		} while (result.indexOf(x) >= 0);

		result.push(x);
	}

	return result;
};

var assert = function(bool) {
	if (!bool) {
		console.log("Failed: ", arguments);
	}
}

var testRandomInts = function() {
	for (var i = 0; i < 100; i++) {
		var x = randomInt(0,10);
		assert(Math.floor(x) === x && 0 <= x && x < 10, x);
	}

	for (var i = 0; i < 10; i++) {
		console.log(randomInts(0, 100, 10));
	}

	console.log("Tests done!");
}

module.exports = {
  randomInt: randomInt,
  randomInts: randomInts
};
