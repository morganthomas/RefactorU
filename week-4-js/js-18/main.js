// TODO:
//  * Random quote button
//  * Author pages

// Global variables
var editorToggleState;
var quoteListModifiedBus; // A bus to push to whenever the quote list is modified in any way

function immutableToJS(obj) {
  return obj.toJS();
}

// Takes a DOM element and returns a property which is true when the element
// is being hovered over, and false the rest of the time.
function hoverProperty($elt) {
  return $elt.asEventStream('mouseenter').map(true)
    .merge($elt.asEventStream('mouseleave').map(false))
    .toProperty(false);
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
    rating: getRatingDisplayValue($quote.find('.rating'))
  });
}

//
// Rating displays
//

var RATING_SCALE_SIZE = 5;

// Makes a new rating display, and returns the DOM element,
// a bus by which the rating can be set, and a property by which the
// rating can be got.
function makeRatingDisplay(startValue) {
  var $rating = $('<div class="rating"></div>');
  var bus = new Bacon.Bus();

  bus.onValue(function(rating) {
    setRatingDisplayValue($rating, rating, bus);
    quoteListModifiedBus.push(true);
  });

  var property = bus.toProperty();

  bus.push(startValue);

  return {element: $rating, bus: bus, property: property};
}

function getRatingDisplayValue($rating) {
  return $rating.data('rating');
}

function setRatingDisplayValue($rating, rating, bus) {
  $rating.data('rating', rating);
  $rating.empty();

  var $stars = (new Immutable.List(Array(5))).map(function() {
    return $('<i></i>');
  });

  $stars.forEach(function($star, i) {
    $rating.append($star);

    var starClickStream = $star.asEventStream('click');
    starClickStream.subscribe(function() {
      bus.push(i + 1);
    });
  });

  var starHoverStreams = $stars.map(function($star, i) {
    return hoverProperty($star).map(function(hover) {
      return [i, hover];
    });
  });

  // starHoverStreams.map(function(stream) { stream.log(); });

  // Bacon.combineAsArray(starHoverStreams.toJS()).log();

  var starHoverValue = Bacon.combineAsArray(starHoverStreams.toJS())
    .map(function(hoverVals) {
      return Math.max.apply(Math,
        hoverVals.filter(function(hoverVal) {
          return hoverVal[1];
        }).map(function(hoverVal) { return hoverVal[0]; })
      );
    });

  // starHoverValue.log();

  var starValues = (new Immutable.List(Array(5))).map(function(val, i) {
    return starHoverValue.map(function(hoverValue) {
      return i + 1 <= rating ? (i <= hoverValue || hoverValue < 0 ? 'on' : 'mid') :
                               (i <= hoverValue && hoverValue >= 0 ? 'mid' : 'off')
    });
  });

  var VALUE_CLASSES = {
    'on': ['fa', 'fa-star'],
    'mid': ['fa', 'fa-star', 'greyed'],
    'off': ['fa', 'fa-star-o']
  };

  starValues.forEach(function(valueStream, i) {
    valueStream.subscribe(function(val) {
      if (val.hasValue()) {
        $stars.get(i).removeClass();
        VALUE_CLASSES[val.value()].forEach(function (cls) {
          $stars.get(i).addClass(cls);
        });
      }
    });
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
    return new Immutable.Map({
      type: 'add',
      quote: new Quote({ author: event[1], text: event[2],
      rating: getRatingDisplayValue($('#editor-rating'))
    })});
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
    return on ? "Done Editing" : "Edit Quote Database";
  });

  toggleButtonLabel.assign($('#editor-toggle'), 'attr', 'value');
}

function makeResortFunction() {
  var listIsOutOfOrder = quoteListModifiedBus.map(function() {
    return quoteListIsOutOfOrder();
  }).toProperty(false);

  var resortButtonVisibility = listIsOutOfOrder.map(function(is) {
    return is ? 'visible' : 'hidden'
  });

  resortButtonVisibility.assign($('#resort-button'), "css", "visibility");

  $('#resort-button').asEventStream('click').onValue(function() {
    sortQuoteList();
  })
}

// Makes the whole bacon event network.
function makeEventNetwork() {
  quoteListModifiedBus = new Bacon.Bus();

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

  makeResortFunction();
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

  quoteListModifiedBus.push(true);
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

  var $rating = makeRatingDisplay(quote.rating).element;
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

  // if ($q.size() > 0) {
  //   if (compareQuotes(domToQuote($q), quote) === 0) {
  //     return;
  //   } else {
  //     $q.before($quote);
  //   }
  // } else {
  //   $('#quote-list').append($quote);
  // }

  if ($q.size() > 0 && compareQuotes(domToQuote($q), quote) === 0) {
    return;
  }

  $('#quote-list').prepend($quote);

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
// Sorting the quote list
//

function offerToSort() {
  // XXX: For now, we just sort.
  if (quoteListIsOutOfOrder()) {
    // console.log("Sorting quote list!");
    // sortQuoteList();
  }
}

function quoteListIsOutOfOrder() {
  var isOutOfOrder = false;
  var quotes = $("#quote-list").children().toArray();

  for (var i = 0; i < quotes.length - 1; i++) {
    if (compareQuotes(domToQuote($(quotes[i])), domToQuote($(quotes[i+1]))) === 1) {
      isOutOfOrder = true;
    }
  }

  return isOutOfOrder;
}

function sortQuoteList() {
  // Insertion sort.
  $('#quote-list').children('.quote').toArray().forEach(function(quote) {
    var $quote = $(quote);
    // Put it in its place
    var $prev = $quote.prev();

    while ($prev.length > 0 &&
      compareQuotes(domToQuote($prev), domToQuote($quote)) === 1) {
      $quote.insertBefore($prev);
      $prev = $prev.prev();
      quoteListModifiedBus.push(true);
    }
  })
}

//
// jQuery setup
//

function makeEditor() {
  var ratingDisplay = makeRatingDisplay(0);
  var $rating = ratingDisplay.element;
  $rating.attr('id', 'editor-rating');
  $('#add-quote-rating').append($rating);

  $('#add-quote-submit').on('click', function() {
    $('#add-quote-author').val('');
    $('#add-quote-text').val('');
    ratingDisplay.bus.push(0);
  });
}

$(document).on('ready', function() {
  $('body').on('click', 'input[type="submit"]', function(event) {
    event.preventDefault();
  });

  makeEventNetwork();
  makeEditor();
  $('#editor').hide();

  // $('body').prepend(makeRatingDisplay(2));
});
