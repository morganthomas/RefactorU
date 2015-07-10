// Assumes the given jQuery element is one in a vertical sequence of elements,
// and has a successor in the sequence. Animates swapping it with the successor.
// This will queue with any other swapping animations (XXX). Assumes the parent
// of the two elements is a positioned element. Assumes both elements are
// visible and relatively positioned. Takes an optional animation duration.
// Takes a callback to execute when the animation is done.
var animateSwapWithSuccessor = (function() {
  // A list of pairs [$elt, duration].
  var queue = [];

  var animateSwapWithSuccessor = function($elt, duration, callback) {
    console.log(queue);

    queue.push([$elt, duration, callback]);

    if (queue.length === 1) {
      doAnimation($elt, duration, callback);
    }
  };

  var doAnimation = function($elt, duration, callback) {
    var $next = $elt.next();

    if ($next.length < 1) {
      queue.shift();
      return;
    }

    var eltOldPos = $elt.position();
    var nextOldPos = $next.position();

    $elt.remove();
    $elt.insertAfter($next);

    var eltNewPos = $elt.position();
    var nextNewPos = $next.position();

    // console.log('eltOldPos', eltOldPos, 'eltNewPos', eltNewPos, 'nextOldPos', nextOldPos, 'nextNewPos', nextNewPos);

    // Now put them back in their old positions.
    $elt.css({ top: (eltOldPos.top - eltNewPos.top) + 'px' });
    $next.css({ top: (nextOldPos.top - nextNewPos.top) + 'px' });

    // Now animate them to their new positions.
    $elt.animate({ top: 0 }, duration, 'linear', processQueue);
    $next.animate({ top: 0 }, duration, 'linear');
  };

  var processQueue = function() {
    if (queue.length > 0) {
      var callback = queue[0][2];

      if (callback) {
        callback();
      }

      queue.shift();

      if (queue.length > 0) {
        var command = queue[0];
        // console.log("Processing", command);
        doAnimation(command[0], command[1], command[2]);
      }
    }
  };

  return animateSwapWithSuccessor;
})();

$(document).on('ready', function() {
  $('body').on('click', 'p', function() {
    animateSwapWithSuccessor($(this), 400, function() { console.log("Woo!"); });
  });

  $('button').on('click', function() {
    var $first = $('#container').children().first();
    [1,2,3,4].forEach(function(i) {
      animateSwapWithSuccessor($first, 100, function() { console.log(i); });
    });
  })
});
