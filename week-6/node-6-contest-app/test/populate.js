var request = require('request');

var submitVideo = function(author, title, url) {
  request.post('http://localhost:3000/submit-action',
    { form: {
        'submitter-name': author,
        'title': title,
        'youtube-url': url
      }
    });
}

submitVideo('Morgan', 'Sledgehammer', 'https://www.youtube.com/watch?v=2oJQjn675vE');
submitVideo('Morgan', 'Cheap Sunglasses', 'https://www.youtube.com/watch?v=__yVuReTu3Q&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=1');
submitVideo('Morgan', 'Burn', 'https://www.youtube.com/watch?v=CGyEd0aKWZE&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=2');
submitVideo('Morgan', 'The Way We Live', 'https://www.youtube.com/watch?v=Y8Q8VkMNqh0&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=3');
submitVideo('Morgan', 'Hideaway', 'https://www.youtube.com/watch?v=ESXgJ9-H-2U&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=5');
submitVideo('Morgan', 'Walking on a Dream', 'https://www.youtube.com/watch?v=VYv6-5VmNEM&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=6');
submitVideo('Morgan', 'Good Times', 'https://www.youtube.com/watch?v=8g6bUe5MDRo&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=7');
submitVideo('Morgan', 'Problem', 'https://www.youtube.com/watch?v=4kTUwAreg7c&list=PLMLvlQmKmjzgU2rZ27GeAYmqvbU-u0XVw&index=9')
