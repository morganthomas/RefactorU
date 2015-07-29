$(document).on('ready', function() {
  $('#translate-button').on('click', function() {
    translate($('#translate-word').val(), $('#translate-from').val(),
        $('#translate-to').val(), function(translation) {
      $('#translation').text(translation);
    });
  });
})
