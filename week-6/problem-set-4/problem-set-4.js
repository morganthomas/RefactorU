var isDigit = function(char) {
  var digits = '0123456789';

  for (var i = 0; i < digits.length; i++) {
    if (char === digits[i]) {
      return true;
    }
  }

  return false;
};

var addNumbers = function(str) {
  var i = 0;
  var sum = 0;

  while (i < str.length) {
    if (isDigit(str[i])) {
      var digits = [];

      while (isDigit(str[i])) {
        digits.push(str[i]);
        i++;
      }

      sum += parseInt(digits.join(''));
    } else {
      i++;
    }
  }

  return sum;
};

var longestWord = function(str) {
  return str.split(' ').reduce(function(bestSoFar, next) {
    if (next.length > bestSoFar.length) {
      return next;
    } else {
      return bestSoFar;
    }
  });
};

function averageStringNumbers(str) {
  return Math.round(addNumbers(str) / str.length);
}

//
// module.exports = {
//   addNumbers: addNumbers,
//   longestWord: longestWord
// }
