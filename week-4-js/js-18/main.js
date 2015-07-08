function immutableToJS(obj) {
  return obj.toJS();
}

// Quotes
var Quote = Immutable.Record({ text: null, author: null, rating: null });

// Gives the ordering on quotes.
function compareQuotes(quote1, quote2) {
  return quote1.rating > quote2.rating ||
    (quote1.rating === quote2.rating &&
      (quote1.author < quote2.author ||
        (quote1.author === quote2.author && quote1.text < quote2.text))) ?
    -1 : (Immutable.is(quote1, quote2) ? 0 : 1);
}

// The list of quotes is represented as an Immutable.List, which is kept sorted
// in our desired order.
var makeEmptyQuoteDB = function() {
  return new Immutable.List();
};

// Quote actions are Immutable.Maps, as follows:
//  { type: 'add', text: string, author: string, rating: 1-5 or null, [index: number] }
//  { type: 'remove', index: number, quote: Quote }
//  { type: 'modify', index: number, [text: string], [author: string], [rating: 1-5 or null] }
//  { type: 'undo' }

// Given a quote DB and an action, returns a new quote DB reflecting the result of the action.
var performActionOnQuoteDB = function(db, act) {
  if (act.get('type') === 'add') {
    // XXX: Put in order
    return db.push(new Quote({ text: act.get('text'), author: act.get('author'), rating: act.get('rating') }));
  } else if (act.get('type') === 'remove') {
    return db.delete(act.get('index'));
  }
};

var quotes = [new Quote({text: "Nowadays people know the price of everything and the value of nothing.", author: "Oscar Wilde", rating: 3}),
  new Quote({text: "Education is an admirable thing, but it is well to remember from time to time that nothing that is worth knowing can be taught.", author: "Oscar Wilde", rating: 3})];

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
    return new Immutable.Map({ type: 'add', author: event[1], text: event[2], rating: null });
  });

  return addActionStream;
}

function makeRemoveActionStream() {
  var removeEventStream = $('#quote-list').asEventStream('click', '.quote-remove button');

  var removeActionStream = removeEventStream.map(function(event) {
    var targetQuote = $(event.currentTarget).closest('.quote');
    var index = targetQuote.prevAll('.quote').length;
    return new Immutable.Map({ type: 'remove', index: index });
  });

  return removeActionStream;
}

var UndoStack = Immutable.Record({ list: new Immutable.List(), index: 0 })

function makeUndo(preUndoQuoteActions) {
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

  undoStack.map(immutableToJS).log();

  var undoActionStream = undoStack.sampledBy(undoEventStream).map(function(stack) {
    return ["undo", stack.list.get(stack.index).toJS()];
  });

  undoActionStream.log();
}

// Makes the whole bacon event network.
function makeEventNetwork() {
  var addActionStream = makeAddActionStream();
  var removeActionStream = makeRemoveActionStream();

  var preUndoQuoteActions = addActionStream.merge(removeActionStream); // XXX

  makeUndo(preUndoQuoteActions);
  var postUndoQuoteActions = preUndoQuoteActions; // XXX

  var quoteList = postUndoQuoteActions.scan(makeEmptyQuoteDB(), performActionOnQuoteDB);
  // quoteList.map(immutableToJS).log();

  var elabQuoteActions = postUndoQuoteActions; // XXX

  elabQuoteActions.onValue(displayQuoteAction);
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
  // XXX: add in order
  var $quote = $('<div class="quote"></div>');

  var $text = $('<div class="quote-text"></div>');
  $text.text(act.get('text'));
  $quote.append($text);

  var $author = $('<div class="quote-author"></div>');
  $author.text(act.get('author'));
  $quote.append($author);

  var $rating = $('<div class="quote-rating"></div>');
  $rating.text(act.get('rating') === null ? '(not rated)' : act.get('rating'));
  $quote.append($rating);

  var $remove = $('<div class="quote-remove"><button>Remove</button></div>');
  $quote.append($remove);

  $('#quote-list').append($quote);
}

function displayRemoveQuoteAction(act) {
  $('#quote-list .quote:nth-child(' + (act.get('index') + 1) + ')').remove();
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
