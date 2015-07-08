function getName(obj) {
  return obj.name;
}

function add(a, b) {
  return a + b;
}

function strlen(str) {
  return str.length;
}

function totalLetters(a) {
  return a.map(strlen).reduce(add, 0);
}

function keyValue(key, value) {
  var obj = {};
  obj[key] = value;
  return obj;
}

function negativeIndex(array, i) {
  return array[array.length + i];
}

function removeM(str) {
  return str.split('').filter(function(c) {
    return c.toUpperCase() !== 'M';
  }).join('');
}

function printObject(obj) {
  Object.keys(obj).forEach(function(key) {
    console.log(key + " is " + obj[key]);
  });
}

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

function contains(array, x) {
  return some(array.map(function(y) {
    return x === y;
  }));
}

function isVowel(c) {
  return contains("aeiou".split(''), c);
}

function vowels(str) {
  return str.split('').filter(isVowel);
}

function range(min, max) {
  var arr = [];
  for (var i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
}

function twins(arr) {
  return arr.length % 2 === 0 &&
    all(range(0, arr.length / 2 - 1).map(function (i) {
      return arr[2*i] === arr[2*i + 1];
    }));
}

function ruOr(bools) {
  for (var i = 0; i < bools.length; i++) {
    if (bools[i]) {
      return true;
    }
  }

  return false;
}

function unique(arr) {
  var result = [];

  arr.forEach(function(elt) {
    if (!contains(result, elt)) {
      result.push(elt);
    }
  })

  return result;
}
