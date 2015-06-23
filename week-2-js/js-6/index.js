function updateProfileFromForm() {
  $(".input").each(function(input) {
    $('#display-' + $(this).prop('name')).text($(this).val());
  })
}

function updateFormFromProfile() {
  $(".input").each(function(input) {
    $(this).val($('#display-' + $(this).prop('name')).text());
  });
}

function formIsDisplayed() {
  return $(".profile-edit").css("display") === "block";
}

function hideForm() {
  $(".profile-edit").css("display", "none");
  $(".show-form-button").val("Show Form");
}

function showForm() {
  $(".profile-edit").css("display", "block");
  $(".show-form-button").val("Hide Form");
  updateFormFromProfile();
}

function showFormClickHandler() {
  if (formIsDisplayed()) {
    hideForm();
  } else {
    showForm();
  }
}

$(document).ready(function() {
  $(".show-form-button").on('click', showFormClickHandler);

  $('.submit').on('click', function(event) {
    event.preventDefault();
    updateProfileFromForm();
  });
});
