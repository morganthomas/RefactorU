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

function plus(a,b) {
  return a+b;
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


function promptForNaturalNumber(promptText) {
  var done = false;
  var result = null;

  while (!done) {
    var input = prompt(promptText);

    if (input !== null && isNumber(input)) {
      done = true;
      result = Number(input);
    } else {
      alert("Please enter a non-negative, whole number.");
    }
  }

  return result;
}

//
// Application code
//

function promptForPeople(peopleType) {
  var peopleArray = [];
  var howManyPeople = promptForNaturalNumber("How many " + peopleType +
    " would you like to enter?");


  for (var i = 1; i <= howManyPeople; i++) {
    function promptFor(what) {
      return prompt("Enter " + peopleType + " " + i + "'s " + what + ":");
    }

    peopleArray.push({
      name: promptFor("name"),
      phone: promptFor("phone number"),
      street: promptFor("street")
    });
  }

  return peopleArray;
}

// Returns a pretty-printed string representation of the given people array.
function pprintPeopleArray(peopleArray, peopleType) {
  if (peopleArray.length == 0) {
    return "No " + peopleType + "!\n\n";
  } else {
    return peopleArray.length + " " + peopleType + ":\n\n" +
      foldl(plus, '',
        map(function(person) {
          return person.name + " (" + person.phone + ")\n" +
                 person.street + "\n\n";
        }, peopleArray));
  }
}

var victims = promptForPeople("disaster victims");

var volunteers = promptForPeople("volunteers");

alert(pprintPeopleArray(victims, "disaster victims") +
      pprintPeopleArray(volunteers, "volunteers"));
