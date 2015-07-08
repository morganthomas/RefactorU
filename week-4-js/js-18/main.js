function immutableToJS(obj) {
  return obj.toJS();
}

// Quotes. Ratings are 1-5; 0 represents no rating.
var Quote = Immutable.Record({ text: "", author: "", rating: 0 });

// Gives the ordering on quotes.
function compareQuotes(quote1, quote2) {
  return quote1.rating > quote2.rating ||
    (quote1.rating === quote2.rating &&
      (quote1.author < quote2.author ||
        (quote1.author === quote2.author && quote1.text < quote2.text))) ?
    -1 : (Immutable.is(quote1, quote2) ? 0 : 1);
}

// Quote actions are Immutable.Maps, as follows:
//  { type: 'add', quote: Quote, [index: number] }
//    Adds the given quote. The index where it belongs may be specified, but is
//    a function of the current quote DB and the quote to be added.
//  { type: 'remove', quote: Quote, [index: number] }
//    Removes the given quote. The index where it is may be specified, but since
//    we allow only one of each quote in the database, the index is a function
//    of the quote DB and the quote.
//  { type: 'modify', index: number, from: Quote, to: Quote }
//    Modifies the quote at the given index, which is assumed to be 'from', to 'to'.
//  { type: 'undo' }
//    Undoes the last action.

// Given an action, yields the inverse of that action (the one that will undo it).
var actionInverse = function(act) {
  if (act.get('type') === 'add') {
    return new Immutable.Map({ type: 'remove', quote: act.get('quote') });
  } else if (act.get('type') === 'remove') {
    return new Immutable.Map({ type: 'add', quote: act.get('quote') });
  }
}

var quotes = [new Quote({text: "Nowadays people know the price of everything and the value of nothing.", author: "Oscar Wilde", rating: 3}),
  new Quote({text: "Education is an admirable thing, but it is well to remember from time to time that nothing that is worth knowing can be taught.", author: "Oscar Wilde", rating: 3})];

// Given a .quote DOM node, extracts the corresponding Quote object.
function domToQuote($quote) {
  return new Quote({
    text: $quote.find('.quote-text').text(),
    author: $quote.find('.quote-author').text(),
    rating: parseInt($quote.find('.quote-rating').text())
  });
}

//
// Bacon event code
//

function makeAddActionStream() {
  var addEventStream = $('#add-quote-submit').asEventStream('click');

  var addFormAuthorStream = Bacon.UI.textFieldValue($("#add-quote-author"));
  var addFormTextStream = Bacon.UI.textFieldValue($("#add-quote-text"));

  var addActionStream = Bacon.zipAsArray(addEventStream,
      addFormAuthorStream.sampledBy(addEventStream),
      addFormTextStream.sampledBy(addEventStream)).map(function(event) {
    return new Immutable.Map({ type: 'add', quote: new Quote({ author: event[1], text: event[2], rating: 0 })});
  });

  return addActionStream;
}

function makeRemoveActionStream() {
  var removeEventStream = $('#quote-list').asEventStream('click', '.quote-remove button');

  var removeActionStream = removeEventStream.map(function(event) {
    var $quote = $(event.currentTarget).closest('.quote');
    // var index = $quote.prevAll('.quote').length;
    return new Immutable.Map({ type: 'remove', quote: domToQuote($quote) });
  });

  return removeActionStream;
}

var UndoStack = Immutable.Record({ list: new Immutable.List(), index: 0 })

function makeUndoActionStream(preUndoQuoteActions) {
  var undoEventStream = $("#undo-button").asEventStream('click').
    map(new Immutable.Map({ type: 'undo' }));

  // The undo stack is an object with properties list and index. The index points
  // to the first point in the list after events which are on the undo stack.
  // There may be nothing at that index, or there may be actions at or after
  // that index which can be redone.
  var undoStack = undoEventStream.merge(preUndoQuoteActions).scan(
    new UndoStack(),
    function(stack, act) {
      if (act.get('type') === 'undo') {
        return new UndoStack({ list: stack.list, index: stack.index - 1 });
      } else {
        return new UndoStack({
          list: stack.list.slice(0, stack.index).push(act),
          index: stack.index + 1
        });
      }
    });

  // undoStack.map(immutableToJS).log();

  var undoActionStream = undoStack.sampledBy(undoEventStream)
    .filter(function(stack) {
      return stack.list.get(stack.index) !== undefined;
    })
    .map(function(stack) {
      var lastAct = stack.list.get(stack.index);
      return actionInverse(lastAct);
    });

  undoActionStream.map(immutableToJS).log();
  return undoActionStream;
}

// Makes the whole bacon event network.
function makeEventNetwork() {
  var addActionStream = makeAddActionStream();
  var removeActionStream = makeRemoveActionStream();

  var preUndoQuoteActions = addActionStream.merge(removeActionStream); // XXX
  var undoActionStream = makeUndoActionStream(preUndoQuoteActions);
  var postUndoQuoteActions = preUndoQuoteActions.merge(undoActionStream); // XXX

  // var quoteList = postUndoQuoteActions.scan(makeEmptyQuoteDB(), performActionOnQuoteDB);
  // quoteList.map(immutableToJS).log();

  postUndoQuoteActions.onValue(displayQuoteAction);
}

//
// Display code
//

// Updates the DOM to reflect a quote action.
function displayQuoteAction(act) {
  if (act.get('type') === 'add') {
    displayAddQuoteAction(act);
  } else if (act.get('type') === 'remove') {
    displayRemoveQuoteAction(act);
  }
}

function displayAddQuoteAction(act) {
  // XXX: add in order, and don't add duplicates
  var quote = act.get('quote');
  var $quote = $('<div class="quote"></div>');

  var $text = $('<div class="quote-text"></div>');
  $text.text(quote.text);
  $quote.append($text);

  var $author = $('<div class="quote-author"></div>');
  $author.text(quote.author);
  $quote.append($author);

  var $rating = $('<div class="quote-rating"></div>');
  $rating.text(quote.rating === null ? '(not rated)' : quote.rating);
  $quote.append($rating);

  var $remove = $('<div class="quote-remove"><button>Remove</button></div>');
  $quote.append($remove);

  $('#quote-list').append($quote);
}

function displayRemoveQuoteAction(act) {
  $('#quote-list .quote').filter(function() {
    return Immutable.is(domToQuote($(this)), act.get('quote'));
  }).remove();
}

//
// jQuery setup
//

$(document).on('ready', function() {
  $('body').on('click', 'input[type="submit"]', function(event) {
    event.preventDefault();
  });

  makeEventNetwork();
});
