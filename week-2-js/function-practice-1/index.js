//
// Application code
//

function tripleFive() {
  for (var i = 0; i < 3; i++) {
    console.log("Five!");
  }
}

function lastLetter(str) {
  return str[str.length - 1];
}

function square(x) {
  return x * x;
}

function negate(x) {
  return -x;
}

function toArray(a,b,c) {
  return [a,b,c];
}

function startsWithA(str) {
  return str.length > 0 &&
    str[0].toUpperCase() === 'A';
}

function excite(str) {
  return str + '!!!';
}

function sun(str) {
  return str.indexOf('sun') >= 0;
}

function tiny(x) {
  return 0 <= x && x <= 1;
}

// Assumes the format is correct.
function getSeconds(str) {
  return Number(str.substring(0,2)) * 60 +
         Number(str.substring(3,5));
}
