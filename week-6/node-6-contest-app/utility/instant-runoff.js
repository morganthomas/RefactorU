var _ = require('lodash');

// Takes an array of ballots, and returns the number of people for whom each
// candidate is a first choice.
function candidateFirstChoiceCounts(candidates, ballots) {
  var counts = {};

  candidates.forEach(function(candidate) {
    counts[candidate] = 0;
  })

  ballots.forEach(function(ballot) {
    counts[ballot[0]]++;
  })

  return counts;
}

// Takes an array of ballots, and returns the candidate who has an absolute
// majority of first preferences, if there is one, or undefined otherwise.
function findAbsoluteWinner(candidates, ballots) {
  var counts = candidateFirstChoiceCounts(candidates, ballots);
  return _.find(candidates, function(candidate) {
    return counts[candidate] && counts[candidate] > (ballots.length / 2);
  });
}

// Takes an array of ballots, and returns an array of candidates with one of the
// least popular first choices removed.
function filterLoser(candidates, ballots) {
  var counts = candidateFirstChoiceCounts(candidates, ballots);
  var minCount = _.min(_.values(counts));

  if (minCount === 0) {
    minCount = _.min(_.without(_.values(counts), 0));
  }

  return _.without(candidates, _.find(candidates, function(candidate) {
    return counts[candidate] === minCount;
  }));
}

// Strikes a candidates with a minimal number of first preferences from
// the candidate list and ballots.
function strikeOutLoser(candidates, ballots) {
  var remainingCandidates = filterLoser(candidates, ballots);
  var struckBallots = ballots.map(function(ballot) {
    return ballot.filter(function(candidate) {
      return _.includes(remainingCandidates, candidate);
    });
  });

  return {
    candidates: remainingCandidates,
    ballots: struckBallots
  };
}

// Takes an array of ballots, which are arrays of the candidates ordered in
// descending order of preference. Performs an instant runoff, outputting the
// winner.
function instantRunoffWinner(candidates, ballots) {
  var winner = findAbsoluteWinner(candidates, ballots);

  if (winner) {
    return winner;
  } else {
    var struck = strikeOutLoser(candidates, ballots);
    return instantRunoffWinner(struck.candidates, struck.ballots);
  }
}

module.exports = {
  instantRunoffWinner: instantRunoffWinner
}
