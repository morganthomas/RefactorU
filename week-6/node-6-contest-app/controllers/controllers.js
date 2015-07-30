var _ = require('lodash');
var getYouTubeVideoIDFromURL = require('../utility/youtube-url.js');
var instantRunoffWinner = require('../utility/instant-runoff.js').instantRunoffWinner;

var contestModel = require('../models/contest.js');
var ContestStatus = contestModel.ContestStatus;
var contest = contestModel.contest;
var resetContest = contestModel.resetContest;

var NUM_SUBMISSIONS_TO_ACCEPT = 8;

var controllers = {
  index: function(req, res) {
    if (contest.status === ContestStatus.voting && contest.ballots.length > 0) {
      var winnerID = instantRunoffWinner(
        contest.submissions.map(function(video) {
          return video.youtubeVideoID;
        }),
        contest.ballots);

      contest.winner = _.find(contest.submissions, function(video) {
        return video.youtubeVideoID === winnerID;
      });
    }

    res.render('index', contestModel);
  },

	submit: function(req, res) {
		res.render('submit');
	},

	submitAction: function(req, res) {
		var videoID = getYouTubeVideoIDFromURL(req.body['youtube-url']);

		if (contest.status === ContestStatus.acceptingSubmissions && videoID) {
			contest.submissions.unshift({
				submitterName: req.body['submitter-name'],
				title: req.body['title'],
				youtubeVideoID: videoID
			});

			if (contest.submissions.length >= NUM_SUBMISSIONS_TO_ACCEPT) {
				contest.status = ContestStatus.voting;
			}
		}

		res.redirect('/');
	},

	vote: function(req, res) {
		if (contest.status === ContestStatus.voting) {
			res.render('vote', contestModel)
		} else {
      res.send("Not voting right now!");
    }
	},

  submitVote: function(req, res) {
    if (contest.status === ContestStatus.voting) {
      contest.ballots.push(req.body['videoList[]']);
    }

    res.send('');
  },

	restart: function(req, res) {
		resetContest();
		res.redirect('/');
	}
};

module.exports = controllers;
