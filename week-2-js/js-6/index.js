$(document).ready(function() {
  var formIsDisplayed = false;

  $(".show-form-button").on('click', function() {
    if (formIsDisplayed) {
      $(".profile-edit").css("display", "none");
      $(this).val("Show Form");
      formIsDisplayed = false;
    } else {
      $(".profile-edit").css("display", "block");
      $(this).val("Hide Form");

      $(".input").each(function(input) {
        $(this).val($('#display-' + $(this).prop('name')).text());
      });

      formIsDisplayed = true;
    }
  });

  $('.submit').on('click', function(event) {
    event.preventDefault();

    $(".input").each(function(input) {
      $('#display-' + $(this).prop('name')).text($(this).val());
    })
  });
});
