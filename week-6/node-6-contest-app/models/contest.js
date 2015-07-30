// Videos are objects with properties submitterName, title, youtubeVideoID.

var ContestStatus = {
  acceptingSubmissions: 'accepting submissions',
  voting: 'voting'
};

var contest = {};

var resetContest = function() {
	contest.status = ContestStatus.acceptingSubmissions;
	contest.winner = null;
	contest.submissions = [];
  contest.ballots = [];
}

resetContest();

module.exports = {
  ContestStatus: ContestStatus,
  contest: contest,
  resetContest: resetContest
}
