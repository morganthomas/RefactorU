$(document).ready(function() {
  $('p').on('mouseenter',
    function() {
      $(this).css('color', 'pink');
    });

  $('p').on('mouseleave',
    function() {
      $(this).css('color', 'inherit');
    })

  $('h1').append('!');

  $('a').on('click',
    function() {
      if (confirm("Are you sure you want this link?")) {
        return true;
      } else {
        $(this).remove();
        return false;
      }
    });
});
