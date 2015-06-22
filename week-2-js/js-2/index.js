var word = prompt("Enter any word.");

alert("You entered: " + word + "\n" +
  "Length: " + word.length + "\n" +
  "Third character: " + word[2] + "\n" +
  "In lower case: " + word.toLowerCase() + "\n" +
  "In upper case: " + word.toUpperCase() + "\n" +
  "In a sentence: " + "Hello, my name is " + word + "!\n" +
  "Substring: " + word.substring(1,4));
