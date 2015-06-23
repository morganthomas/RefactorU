$(document).ready(function() {
  $(".profile").on("click", "dd", function() {
    var profileItemContents = $(this);
    profileItemContents.css("visibility", "hidden");
    var pos = profileItemContents.position();

    var textInput = $('<input type="text" class="in-place-editor">');
    textInput.css("top", pos.top);
    textInput.css("left", pos.left);
    textInput.val(profileItemContents.text());
    textInput.focus();

    textInput.on("keypress", function(keyEvent) {
      if (keyEvent.keyCode === 13) {
        // The user pressed 'enter'
        profileItemContents.css("visibility", "visible");
        profileItemContents.text(textInput.val());
        textInput.remove();
      }
    });

    $(".profile").append(textInput);
  });
});
