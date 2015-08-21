var ACCEPT = 0;
var ACCEPT_WITH_TYPO = 1;
var REJECT = 2;

var strRest = function(str) {
  return str.slice(1);
}

var combineBranches = function() {
  return Math.min.apply(Math, arguments);
}

var somethingWrong = function(guess, answer) {
  return guess === answer ? ACCEPT_WITH_TYPO : REJECT;
}

var nothingWrongYet = function(guess, answer) {
  if (guess.length === 0 && answer.length === 0) {
    return ACCEPT;
  } else if (guess.length > 0 && answer.length === 0) {
    return guess.length === 1 ? ACCEPT_WITH_TYPO : REJECT;
  } else if (guess.length === 0 && answer.length > 0) {
    return answer.length === 1 ? ACCEPT_WITH_TYPO : REJECT;
  } else if (guess[0] === answer[0]) {
    return nothingWrongYet(strRest(guess), strRest(answer));
  } else { // There is something in both strings and the first characters are unequal
    return combineBranches(
      // User mistyped a letter
      somethingWrong(strRest(guess), strRest(answer)),
      // User inserted a letter
      somethingWrong(strRest(guess), answer),
      // User deleted a letter
      somethingWrong(guess, strRest(answer))
    );
  }
}

var isOffByOne = function(guess, answer) {
  return nothingWrongYet(guess, answer);
}
