$(document).ready(function() {
  $("#big-button").on('click', function() {
    var popup = $('<div class="popup"><h1>Boo!!!</h1><input type="button" id="dismiss" value="Dismiss"></div>');
    $("body").append(popup);

    popup.on('click', "#dismiss", function() {
      popup.remove();
    });
  });
});
