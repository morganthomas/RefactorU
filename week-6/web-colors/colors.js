var request = require('request');

// Gets the web colors object and passes it to the callback.
function getWebColors(callback) {
  request('https://cdn.rawgit.com/metaraine/swatch/74580660c9229541622bbf1fd4198618d9f677e5/webcolors.json',
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        callback(JSON.parse(body));
      } else if (!error) {
        console.log("Error " + response.statusCode + " accessing color database.");
      } else {
        console.log(error);
      }
    });
}

// Searches the web colors object for the color with the given name, case
// insensitively. Linear search is fine since the array is small.
function findColor(colors, name) {
  for (var i = 0; i < colors.length; i++) {
    if (colors[i].name.toLowerCase() === name.toLowerCase()) {
      return colors[i];
    }
  }

  return undefined;
}

function findAndPrintColor(name) {
  getWebColors(function(colors) {
    var color = findColor(colors, name);

    if (color) {
      console.log(color.rgb.r, color.rgb.g, color.rgb.b);
    } else {
      console.log("Color not found");
    }
  });
}

function printUsage() {
  console.log("Usage: node colors.js <color-name>");
}

if (process.argv[2]) {
  if (process.argv[2] === '--help') {
    printUsage();
  } else {
    findAndPrintColor(process.argv[2]);
  }
} else {
  printUsage();
}
