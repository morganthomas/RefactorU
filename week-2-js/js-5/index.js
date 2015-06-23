$(document).ready(function() {
  var itemBeingEdited = null;
  var inPlaceEditor = null;

  $("body").on("click", ".editable", function() {
    itemBeingEdited = $(this);
    itemBeingEdited.css("visibility", "hidden");
    var pos = itemBeingEdited.position();

    inPlaceEditor = $('<input type="text" class="in-place-editor">');
    inPlaceEditor.css("top", pos.top);
    inPlaceEditor.css("left", pos.left);
    inPlaceEditor.val(itemBeingEdited.text());

    itemBeingEdited.offsetParent().append(inPlaceEditor);
    inPlaceEditor.focus();
  });

  $("body").on("blur", ".in-place-editor", function() {
    // This works because there is only one in place editor at a time, so
    // we can assume the one that triggered this event is the one we have
    // stored in our variables.
    itemBeingEdited.css("visibility", "visible");
    itemBeingEdited.text(inPlaceEditor.val());
    inPlaceEditor.remove();
    itemBeingEdited = null;
    inPlaceEditor = null;
  });
});
