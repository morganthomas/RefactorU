$(document).on('ready', function() {
  var outerShell = $('<div class="clock-outer-shell"></div>');
  var innerShell = $('<div class="clock-inner-shell"></div>');
  outerShell.append(innerShell);

  var AMPMLabel = $('<div class="clock-left-label clock-am-pm-label">PM</div>');
  var autoLabel = $('<div class="clock-left-label clock-auto-label">Auto</div>');
  var clockScreen = $('<div class="clock-screen"></div>');
  innerShell.append(AMPMLabel).append(autoLabel).append(clockScreen);

  var clockAutoIndicator = $('<div class="clock-indicator clock-auto-indicator"></div>');
  var clockPMIndicator = $('<div class="clock-indicator clock-pm-indicator"></div>');
  var clockText = $('<div class="clock-text"></div>');
  clockScreen.append(clockAutoIndicator).append(clockPMIndicator).append(clockText);

  var amFreqs = [53, 60, 70, 90, 110, 140, 170];
  var fmFreqs = [88, 92, 96, 100, 104, 108];

  function makeFreqs(name, freqs) {
    var freqLabel = $('<div class="clock-freq-label"></div>');
    freqLabel.text(name.toUpperCase());

    var freqList = $('<ol class="clock-freq-list"></ol>');
    freqs.forEach(function (freq) {
      var freqLi = $('<li></li>');
      freqLi.text(freq);
      freqList.append(freqLi);
    });

    var freqDisp = $('<div class="clock-freq-display clock-freq-' + name + '-display"></div>');
    freqDisp.append(freqLabel).append(freqList);
    innerShell.append(freqDisp);
  }

  makeFreqs("am", amFreqs);
  makeFreqs("fm", fmFreqs);

  $('.container').append(outerShell);

  var updateTime = function() {
    var currentTime = new Date();
    var militaryHours = currentTime.getHours();
    var hours;

    if (militaryHours > 12) {
      hours = militaryHours - 12;
      $('.clock-pm-indicator').css("visibility", "visible");
    } else {
      hours = militaryHours;
      $('.clock-pm-indicator').css("visibility", "hidden");
    }

    if (hours === 0) {
      hours = 12;
    }

    var timeText = hours + '<span class="clock-time-colon">:</span>' +
      currentTime.getMinutes();
    clockText.html(timeText);
  }

  updateTime();
  setTimeout(updateTime, 1000);
});
