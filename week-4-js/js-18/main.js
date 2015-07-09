// TODO:
//  * Make ratings work
//  * Random quote button
//  * Author pages

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
    -1 : (quote1.author === quote2.author && quote1.text === quote2.text ? 0 : 1);
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

function makeUndoRedoActionStream(preUndoQuoteActions) {
  var undoEventStream = $("#undo-button").asEventStream('click').
    map(new Immutable.Map({ type: 'undo' }));

  var redoEventStream = $("#redo-button").asEventStream('click').
    map(new Immutable.Map({ type: 'redo' }));

  var undoRedoEventStream = undoEventStream.merge(redoEventStream);

  // The undo stack is an object with properties list and index. The index points
  // to the first point in the list after events which are on the undo stack.
  // There may be nothing at that index, or there may be actions at or after
  // that index which can be redone.
  var undoStack = undoRedoEventStream.merge(preUndoQuoteActions).scan(
    new UndoStack(),
    function(stack, act) {
      if (act.get('type') === 'undo') {
        return new UndoStack({ list: stack.list,
          index: stack.index > 0 ? stack.index - 1 : stack.index });
      } else if (act.get('type') === 'redo') {
        return new UndoStack({ list: stack.list,
          index: stack.list.get(stack.index) !== undefined ? stack.index + 1 : stack.index });
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

  var redoActionStream = undoStack.sampledBy(redoEventStream)
    .filter(function(stack) {
      return stack.index > 0;
    })
    .map(function(stack) {
      var lastAct = stack.list.get(stack.index - 1);
      return lastAct;
    });

  return undoActionStream.merge(redoActionStream);
}

function makeVirtualActionStream() {
  var quotes = [new Quote({text: "Nowadays people know the price of everything and the value of nothing.", author: "Oscar Wilde", rating: 3}),
    new Quote({text: "Education is an admirable thing, but it is well to remember from time to time that nothing that is worth knowing can be taught.", author: "Oscar Wilde", rating: 5}),
    new Quote({text: "Above all the grace and the gifts that Christ gives to his beloved is that of overcoming self.", author: "St. Francis", rating: 4})];

  return Bacon.fromArray(quotes).map(function(quote) {
    return new Immutable.Map({ type: "add", quote: quote });
  }).delay(1000);
}

function makeEditorToggleState() {
  var toggleEditorEventStream = $('#editor-toggle').asEventStream('click');

  editorToggleState = toggleEditorEventStream.scan(false, function(prev, ev) {
    return !prev;
  });

  editorToggleState.onValue(function(on) {
    if (on) {
      $('#editor').slideDown();
      // $('.quote-remove').slideDown();
    } else {
      $('#editor').slideUp();
      // $('.quote-remove').slideUp();
    }
  });

  var toggleButtonLabel = editorToggleState.map(function(on) {
    return on ? "Hide Editor" : "Edit Quote Database";
  });

  toggleButtonLabel.assign($('#editor-toggle'), 'attr', 'value');
}

var editorToggleState;

// Makes the whole bacon event network.
function makeEventNetwork() {
  makeEditorToggleState();

  var addActionStream = makeAddActionStream();
  var removeActionStream = makeRemoveActionStream();
  var virtualActionStream = makeVirtualActionStream();

  var preUndoQuoteActions = addActionStream
    .merge(removeActionStream)
    .merge(virtualActionStream);
  var undoRedoActionStream = makeUndoRedoActionStream(preUndoQuoteActions);
  var postUndoQuoteActions = preUndoQuoteActions.merge(undoRedoActionStream);

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

  var $remove = $('<div class="quote-remove"><button class="btn btn-danger">Remove</button></div>');
  editorToggleState.subscribe(function(event) {
    if (event.isInitial()) {
      if (!event.value()) {
        $remove.hide();
      }
    } else if (event.value()) {
      $remove.slideDown();
    } else {
      $remove.slideUp();
    }
  });
  $quote.append($remove);

  $quote.hide();

  // Find place to put quote.
  var $q = $('#quote-list').children('.quote').first();

  while ($q.size() > 0 && compareQuotes(domToQuote($q), quote) < 0) {
    $q = $q.next('.quote');
  }

  if ($q.size() > 0) {
    if (compareQuotes(domToQuote($q), quote) === 0) {
      return;
    } else {
      $q.before($quote);
    }
  } else {
    $('#quote-list').append($quote);
  }

  $quote.slideDown();
}

function displayRemoveQuoteAction(act) {
  var $quote = $('#quote-list .quote').filter(function() {
    return Immutable.is(domToQuote($(this)), act.get('quote'));
  });

  $quote.slideUp(function() {
    $quote.remove();
  });
}

//
// jQuery setup
//

$(document).on('ready', function() {
  $('body').on('click', 'input[type="submit"]', function(event) {
    event.preventDefault();
  });

  $('#editor').hide();

  makeEventNetwork();
});
