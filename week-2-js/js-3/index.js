//
// Utility functions
//

function map(f, xs) {
  var result = new Array(xs.length);

  for (var i = 0; i < xs.length; i++) {
    result[i] = f(xs[i]);
  }

  return result;
}

function foldl(reducer, start, xs) {
  var result = start;

  for (var i = 0; i < xs.length; i++) {
    result = reducer(result, xs[i]);
  }

  return result;
}

// Universal and existential quantification over arrays of booleans
function all(bools) {
  return foldl(function(a,b) { return a && b; }, true, bools);
}

function some(bools) {
  return foldl(function(a,b) { return a || b; }, false, bools)
}

// Returns true if the given string represents a natural number.
function isNumber(str) {
  return all(map(function(char) {
    var zeroCode = '0'.charCodeAt(0);
    var nineCode = '9'.charCodeAt(0);
    var charCode = char.charCodeAt(0);
    return zeroCode <= charCode && charCode <= nineCode;
  }, str.split('')));
}

// Returns true if the given value is in the given array.
function contains(arr, val) {
  return some(map(function (x) { return x === val; }, arr));
}

//
// Application code
//

function validate(what, format, additionalMessage, validator) {
  var done = false;

  while (!done) {
    var input = prompt("Please enter your " + what + ", in the format " + format + ". " + additionalMessage);

    if (input === null) {
      alert("You didn't enter any input; OK, let's move on!");
      done = true;
    } else if (validator(input)) {
      alert("Your " + what + " is valid!");
      done = true;
    } else {
      alert("Your " + what + " is invalid! I'll ask you for it again.");
    }
  }
}

var stateAbbrevs = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
  'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO',
  'MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

function validateAll() {
  validate("phone number", "xxx-xxx-xxxx", "Don't worry; it won't be used for spam!",
   function(phoneNumber) {
     return phoneNumber.length === 12 &&
            phoneNumber[3] === '-' &&
            phoneNumber[7] === '-' &&
            isNumber(phoneNumber.substring(0,3)) &&
            isNumber(phoneNumber.substring(4,7)) &&
            isNumber(phoneNumber.substring(8,12));
   });

  validate("birth date", "xx/xx/xx", "Don't worry; it won't be used for identity theft!",
    function(birthDate) {
      return birthDate.length == 8 &&
             birthDate[2] === '/' &&
             birthDate[5] === '/' &&
             isNumber(birthDate.substring(0,2)) &&
             isNumber(birthDate.substring(3,5)) &&
             isNumber(birthDate.substring(6,8));
    });

  validate("state abbreviation", "XX", "Please write in all caps.",
    function(stateAbbrev) {
      return contains(stateAbbrevs, stateAbbrev);
    });

  validate("marital status", "'yes' if you are married, or 'no' if you are not married", '',
    function (married) {
      var marriedInLower = married.toLowerCase();
      return marriedInLower === "yes" || marriedInLower === "no";
    });
}

validateAll();
