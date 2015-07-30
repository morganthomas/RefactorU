function alphabetSoup(str) {
  return str.split('').sort().join('');
}

function isVowel(c) {
  return 'aeiou'.indexOf(c) >= 0;
}

function vowelCount(str) {
  return str.split('').filter(isVowel).length;
}

// Solve coinDeterminer using dynamic programming
var coins = [1,5,7,9,11];

var memo = [];
memo[0] = 0;

coins.forEach(function(coin) {
  memo[coin] = 1;
});

function coinDeterminer(n) {
  if (memo[n] !== undefined) {
    return memo[n];
  } else {
    var min = n;

    for (var i = 1; i <= n / 2; i++) {
      // Try splitting into i and n - i
      var v = coinDeterminer(i) + coinDeterminer(n - i);
      if (v < min) {
        min = v;
      }
    }

    // Now we know the true min
    memo[n] = min;
    return min;
  }
}
