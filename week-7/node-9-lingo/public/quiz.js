var checkAnswer = function(quizItem) {
  var $quizItem = $(quizItem);

  if (!$quizItem.attr('data-correct')) {
    var submission = $quizItem.find('.quiz-input').val();
    var translation = $quizItem.attr('data-translation')

    if(submission === translation){
      $quizItem.append('<i class="fa fa-check"></i>')
      $quizItem.attr('data-correct', 'true');
    }
    else{
      $quizItem.append('<i class="fa fa-times"></i>')
      $quizItem.append(translation)
      $quizItem.attr('data-correct', 'false');
    }
  }
};

var checkAllAnswers = function() {
  $('.quiz-item').toArray().forEach(checkAnswer);
}

$(document).on('ready', function() {
  var targetLanguage = $('#quiz-language').attr('data-language');

  $('.quiz-item').toArray().forEach(function(quizItem) {
    var englishWord = $(quizItem).attr('data-word');

    translate(englishWord, 'en', targetLanguage, function(translatedWord) {
      $(quizItem).attr('data-translation', translatedWord);
    })
  });

  $('.question-submit').on('click',function(){
    checkAnswer($(this).closest('.quiz-item'));
    computeScore();
  });

  $('#quiz-submit').on('click', function() {
    checkAllAnswers();
    var quiz = [];

    $('.quiz-item').toArray().forEach(function(quizItem) {
      var quizItemRecord = {
        word: $(quizItem).attr('data-word'),
        translation: $(quizItem).attr('data-translation'),
        userAnswer: $(quizItem).find('.quiz-input').val(),
        correct: $(quizItem).attr('data-correct') === 'true'
      };

      quiz.push(quizItemRecord);
    });

    $.ajax({
      method: 'POST',
      url: /submit-quiz,
      data: {data: quiz},
      success: function(){};

    })
  })
});

var computeScore = function() {
  var numAnswered = 0;
  var numCorrect = 0;

  $('.quiz-item').toArray().forEach(function(quizItem) {
    if ($(quizItem).attr('data-correct')) {
      numAnswered++;

      if ($(quizItem).attr('data-correct') === 'true') {
        numCorrect++;
      }
    }
  });

  $('#score').text(numCorrect + '/' + numAnswered);
}
