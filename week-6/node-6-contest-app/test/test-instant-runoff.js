var instantRunoff = require('../utility/instant-runoff.js');
var instantRunoffWinner = instantRunoff.instantRunoffWinner;

var allPassed = true;

function assert(text, bool) {
  if (!bool) {
    console.log("Test failed: " + text);
    allPassed = false;
  }
}

function testInstantRunoff() {
  var candidates = [1,2,3];

  var ballots1 = [[1,2,3], [1,3,2], [2,3,1]];
  assert(1, instantRunoffWinner(candidates, ballots1) === 1);

  var ballots2 = [[1,2,3], [2,3,1], [3,2,1], [2,1,3]];
  assert(2, instantRunoffWinner(candidates, ballots2) === 2);

  var ballots3 = [[1,2,3], [3,2,1]];
  assert(3, instantRunoffWinner(candidates, ballots3) === 3);

  if (allPassed) {
    console.log("All tests passed!");
  }
}

testInstantRunoff();
