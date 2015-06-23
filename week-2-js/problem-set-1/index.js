//
// Utility
//

function or(a,b) {
  return a || b;
}

function some(bools) {
  return bools.reduce(or, false);
}

function and(a,b) {
  return a && b;
}

function all(bools) {
  return bools.reduce(and, true);
}

// Gives all natural numbers greater than or equal to n and less than m.
function range(m,n) {
  var result = new Array(n - m);
  for (var i = 0; i < n - m; i++) {
    result[i] = i+m;
  }
  return result;
}

//
// Implementation
//

function capitalizeFirstLetter(word) {
  var letters = word.split('');
  letters[0] = letters[0].toUpperCase();
  return letters.join('');
}

function letterCapitalize(str) {
  return str.split(' ').map(capitalizeFirstLetter).join(' ');
}

function wordCount(str) {
  return str.split(' ').length;
}

function primeTime(n) {
  if (n === 1) {
    return true;
  } else {
    return all(range(2,n).map(function(m) {
      return n % m !== 0;
    }));
  }
}
