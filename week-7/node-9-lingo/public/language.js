var API_KEY = 'AIzaSyCA1ASZU9P4FMDBM_7USD6oUVW6BDobg5E';

var translate = function(word, source, target, callback) {
  $.ajax({
    url: 'https://www.googleapis.com/language/translate/v2',

    method: 'GET',

    data: {
      key: API_KEY,
      q: word,
      source: source,
      target: target
    },

    dataType: 'json',

    success: function(res) {
      callback(res.data.translations[0].translatedText);
      // console.log(res);
    },

    error: function(xhr, status, error) {
      console.log("Error: ", status, error);
    }
  });
};

$(document).on('ready', function() {
  $.ajax({
    url: 'https://www.googleapis.com/language/translate/v2/languages',

    data: {
      key: API_KEY,
      target: 'en'
    },

    dataType: 'json',

    success: function(res) {
      console.log(res);

      res.data.languages.forEach(function(language) {
        $('.language-selector').toArray().forEach(function(languageSelector) {
          var $option = $('<option></option>');
          $option.val(language.language);
          $option.text(language.name);

          $(languageSelector).append($option);
        });
      });
    }
  });
});
