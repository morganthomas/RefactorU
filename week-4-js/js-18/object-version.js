// This library lets you do version control on objects, in essence. It lets
// you keep track of the changes that have been made to an object, and roll
// back those changes. It is written in a pure functional style.

// Call the data type which we wish to do version control on t. An Operation is
// an object which has a method perform :: t -> t which applies the operation
// to the object. It could also have other data associated with it. perform
// should be non-destructive.

// A VersionedObject is an object with a properties:
//   value :: t
//   predecessor :: VersionedObject or null
//   diff :: Operation or null
// where predecessor is the object this one was created from, and diff the
// operation used to create it, or null if this is a virgin object.
//
// A VersionedObject has methods:
//   apply :: Operation -> VersionedObject
//     Produces a new versioned object by applying the given operation to this one.
//   forget :: VersionedObject
//     Produces a new versioned object which is like this one, but without history.

var VersionedObject = Immutable.Record({ value: null, predecessor: null, diff: null });

VersionedObject.prototype.apply = function(operation) {
  return new VersionedObject({value: operation.perform(this.value),
    predecessor: this, diff: operation});
};

VersionedObject.prototype.forget = function() {
  return new VersionedObject({value: this.value, predecessor: null, diff: null});
}
