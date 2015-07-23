var url = require('url');

// Takes a URL and attempts to extract a YouTube video ID from it. Returns
// the video ID on success, or null on failure.
function getYouTubeVideoIDFromURL(urlString) {
  var parsedUrl = url.parse(urlString, true);

  if (parsedUrl.query && parsedUrl.query.v) {
    return parsedUrl.query.v;
  } else if (parsedUrl.hostname === 'youtu.be') {
    return parsedUrl.pathname.slice(1);
  } else {
    return null;
  }
}

module.exports = getYouTubeVideoIDFromURL;
