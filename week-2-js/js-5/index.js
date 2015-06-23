$(document).ready(function() {
  var profileItemBeingEdited = null;
  var inPlaceEditor = null;

  $(".profile").on("click", "dd", function() {
    profileItemBeingEdited = $(this);
    profileItemBeingEdited.css("visibility", "hidden");
    var pos = profileItemBeingEdited.position();

    inPlaceEditor = $('<input type="text" class="in-place-editor">');
    inPlaceEditor.css("top", pos.top);
    inPlaceEditor.css("left", pos.left);
    inPlaceEditor.val(profileItemBeingEdited.text());

    $(".profile").append(inPlaceEditor);
    inPlaceEditor.focus();
  });

  $(".profile").on("blur", ".in-place-editor", function() {
    // This works because there is only one in place editor at a time, so
    // we can assume the one that triggered this event is the one we have
    // stored in our variables.
    profileItemBeingEdited.css("visibility", "visible");
    profileItemBeingEdited.text(inPlaceEditor.val());
    inPlaceEditor.remove();
    profileItemBeingEdited = null;
    inPlaceEditor = null;
  });
});
