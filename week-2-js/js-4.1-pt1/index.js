$("#the-button").on('click', function() {
  $("body").append($('<div class="message">Ouch!</div>'));
});

$("#the-other-button").on('click', function() {
  $("body").append($('<h1>Yay!</h1>'))
});

$("#the-other-other-button").on('click', function() {
  $("body").append($('<ul><li>One?</li><li>Two??</li><li>Three???</li></ul>'));
})
