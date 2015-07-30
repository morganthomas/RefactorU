var videoList = document.getElementById('videos');
var sortable = Sortable.create(videoList, { animation: 150 });

function getVideoList() {
  return $('#videos').children().toArray().map(function(video) {
    return $(video).attr('data-video-id');
  });
}

$('#submit-vote').on('click', function() {
  $.ajax({
    url: '/submit-vote',
    data: { videoList: getVideoList() },
    type: "POST",

    success: function() {
      alert("Vote submitted!");
      window.location.assign('http://localhost:3000/'); // XXX: Don't bake in the domain/port
    },

    error: function(xhr, status, errorThrown) {
      console.log(xhr, status, errorThrown);
      alert("Could not submit vote. Please try again in a minute. " + errorThrown.toString());
    }
  });
})
