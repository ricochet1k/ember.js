/**
  This test file is designed to capture performance regressions related to
  deferred computation. Things like run loops, computed properties, and bindings
  should run the minimum amount of times to achieve best performance, so any
  bugs that cause them to get evaluated more than necessary should be put here.
*/

module("Computed Properties - Number of times evaluated");

test("computed properties that depend on multiple properties should run only once per run loop", function() {
  var obj = {a: 'a', b: 'b', c: 'c'};
  var count = 0;
  SC.defineProperty(obj, 'abc', SC.computed(function(key) {
    count++;
    return 'computed '+key;
  }).property('a', 'b', 'c'));

  SC.beginPropertyChanges();
  SC.set(obj, 'a', 'aa');
  SC.set(obj, 'b', 'bb');
  SC.set(obj, 'c', 'cc');
  SC.endPropertyChanges();

  SC.get(obj, 'abc');

  equal(count, 1, "The computed property is only invoked once");
});

test("computed properties that depend on multiple properties should run only once per run loop", function() {
  var obj = {a: 'a', b: 'b', c: 'c'};
  var cpCount = 0, obsCount = 0;

  SC.defineProperty(obj, 'abc', SC.computed(function(key) {
    cpCount++;
    return 'computed '+key;
  }).property('a', 'b', 'c'));

  SC.addObserver(obj, 'abc', function() {
    obsCount++;
  });

  SC.beginPropertyChanges();
  SC.set(obj, 'a', 'aa');
  SC.set(obj, 'b', 'bb');
  SC.set(obj, 'c', 'cc');
  SC.endPropertyChanges();

  SC.get(obj, 'abc');

  equal(cpCount, 1, "The computed property is only invoked once");
  equal(obsCount, 1, "The observer is only invoked once");
});
