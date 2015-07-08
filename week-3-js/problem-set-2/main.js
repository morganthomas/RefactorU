function firstReverse(str) {
  var fwd = str.split('');
  var rev = [];

  for (var i = fwd.length - 1; i >= 0; i--) {
    rev.push(fwd[i]);
  }

  return rev.join('');
}

function swapCase(str) {
  return str.split('').map(function(c) {
    return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
  }).join('');
}
