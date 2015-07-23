var _ = require('lodash');
var getYouTubeVideoIDFromURL = require('../youtube-url.js');

// Videos are objects with properties submitterName, title, youtubeVideoID.

var NUM_SUBMISSIONS_TO_ACCEPT = 8;

var ContestStatus = {
  acceptingSubmissions: 'accepting submissions',
  voting: 'voting',
  done: 'done'
};

var contest = {};

var resetContest = function() {
	contest.status = ContestStatus.acceptingSubmissions;
	contest.winner = null;
	contest.submissionsInRunning = [];
	contest.submissionsEliminated = [];
}

resetContest();

var contestViewInfo = {
  ContestStatus: ContestStatus,
  contest: contest
};

var controllers = {
  index: function(req, res) {
    res.render('index', contestViewInfo);
  },

	submit: function(req, res) {
		res.render('submit');
	},

	submitAction: function(req, res) {
		var videoID = getYouTubeVideoIDFromURL(req.body['youtube-url']);

		if (contest.status === ContestStatus.acceptingSubmissions && videoID) {
			contest.submissionsInRunning.push({
				submitterName: req.body['submitter-name'],
				title: req.body['title'],
				youtubeVideoID: videoID
			});

			if (contest.submissionsInRunning.length >= NUM_SUBMISSIONS_TO_ACCEPT) {
				contest.status = ContestStatus.voting;
			}
		}

		res.redirect('/');
	},

	vote: function(req, res) {
		if (contest.status === ContestStatus.voting) {
			var videos = _.sample(contest.submissionsInRunning, 2);
			res.render('vote', { videos: videos })
		}
	},

	eliminate: function(req, res) {
		if (contest.status === ContestStatus.voting) {
			var submissionIndex = _.findIndex(contest.submissionsInRunning,
				function(video) {
					return video.youtubeVideoID === req.params.videoID;
				});

			if (submissionIndex >= 0) {
				var submission = contest.submissionsInRunning[submissionIndex];
				contest.submissionsInRunning.splice(submissionIndex, 1);
				contest.submissionsEliminated.unshift(submission);

				if (contest.submissionsInRunning.length === 1) {
					contest.status = ContestStatus.done;
					contest.winner = contest.submissionsInRunning[0];
					contest.submissionsInRunning = [];
				}
			}
		}

		res.redirect('/');
	},

	restart: function(req, res) {
		resetContest();
		res.redirect('/');
	}
};

module.exports = controllers;
