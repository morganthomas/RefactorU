var MS_IN_A_DAY = 1000 * 60 * 60 * 24;

// Formats a date according to the format for displaying a day.
function formatDay(date) {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

$(document).on('ready', function() {
  /* In place editor */
  var itemBeingEdited;

  function inPlaceEditStart(toEdit) {
    itemBeingEdited = toEdit;
    itemBeingEdited.css("visibility", "hidden");
    var pos = itemBeingEdited.position();

    inPlaceEditor = $('<input type="text" class="in-place-editor">');
    inPlaceEditor.css("top", pos.top);
    inPlaceEditor.css("left", pos.left);
    inPlaceEditor.val(itemBeingEdited.text());

    itemBeingEdited.offsetParent().append(inPlaceEditor);
    inPlaceEditor.focus();
  }

  $(".in-place-editor-delegate").on("click", ".editable", function(event) {
    console.log("editable click");
    event.stopImmediatePropagation(); // Stops from adding an agenda item
    inPlaceEditStart($(this));
  });

  $(".in-place-editor-delegate").on("blur", ".in-place-editor", function() {
    // This works because there is only one in place editor at a time, so
    // we can assume the one that triggered this event is the one we have
    // stored in our variables.
    itemBeingEdited.css("visibility", "visible");
    itemBeingEdited.text(inPlaceEditor.val());
    inPlaceEditor.remove();
    itemBeingEdited = null;
    inPlaceEditor = null;
  });

  /* Infinite scrolling agenda */
  var firstUnusedDay = new Date();

  var addDayToAgenda = function() {
    var $day = $('<div class="day"></div>');
    var $date = $('<div class="date">' + formatDay(firstUnusedDay) + '</div>');
    var $dayAgenda = $('<ul class="day-agenda"></ul>');
    $day.append($date).append($dayAgenda);
    $('#agenda').append($day);

    var nextUnusedDay = new Date(firstUnusedDay.getTime() + MS_IN_A_DAY);
    firstUnusedDay = nextUnusedDay;
  }

  // Fills the window with days.
  var fillWithDays = function() {
    while ($('#agenda').offset().top + $('#agenda').outerHeight(false) <
           $(window).scrollTop() + $(window).height()) {
      addDayToAgenda();
    }
  }

  for (var i = 0; i < 7; i++) {
    addDayToAgenda();
  }
  fillWithDays();

  $(window).on('scroll', fillWithDays);

  /* Adding appoinments to a day. */
  var addAppointment = function() {
    console.log("Add appointment");
    var $appointmentText = $('<span class="editable"></span>');
    var $appointment = $('<li></li>');
    $appointment.append($appointmentText);
    $(this).find('.day-agenda').append($appointment);
    inPlaceEditStart($appointmentText);
  }

  $('#agenda').on('click', '.day', addAppointment);
});
