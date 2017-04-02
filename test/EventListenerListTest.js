/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />
"use strict";
var chai = require("chai");
var EventListenerList = require("../EventListenerList");
var asr = chai.assert;
suite("EventListenerList", function ArraysTest() {
    var createListenerList = function () { return EventListenerList.newInst(); };
    var sortNames = function (a, b) { return a.name.localeCompare(b.name); };
    test("addListenerAndFireEvents", function addListenerAndFireEventsTest() {
        var ell = createListenerList();
        var all = 0;
        var once = 0;
        var twice = 0;
        var thrice = 0;
        ell.addListener(function () { return all++; });
        ell.addOneTimeListener(function () { return once++; });
        ell.addNTimeListener(2, function () { return twice++; });
        ell.addNTimeListener(3, function () { return thrice++; });
        ell.fireEvent({ name: "one", chance: 0.0 });
        ell.fireEvent({ name: "two", chance: 0.2 });
        ell.fireEvent({ name: "three", chance: 0.4 });
        ell.fireEvent({ name: "four", chance: 0.6 });
        ell.fireEvent({ name: "five", chance: 0.8 });
        ell.reset();
        ell.fireEvent({ name: "six", chance: 1 });
        asr.equal(all, 5);
        asr.equal(once, 1);
        asr.equal(twice, 2);
        asr.equal(thrice, 3);
    });
    test("addAndRemoveListener", function addAndRemoveListenerTest() {
        var ell = createListenerList();
        var added = 0;
        var removed = 0;
        var aC = 0;
        var bC = 0;
        var cC = 0;
        var lstA = function a() { aC++; };
        var lstB = function b() { bC++; };
        var lstC = function c() { cC++; };
        ell.setListenerAddedCallback(function () { return added++; });
        ell.setListenerRemovedCallback(function () { return removed++; });
        ell.addListener(lstA);
        ell.addListener(lstB);
        asr.deepEqual(ell.getListeners().sort(sortNames), [lstA, lstB]);
        ell.removeListener(lstA);
        ell.addListener(lstC);
        asr.deepEqual(ell.getListeners().sort(sortNames), [lstB, lstC]);
        asr.equal(added, 3);
        asr.equal(removed, 1);
    });
    test("fireEvents", function fireEventsTest() {
        var ell = createListenerList();
        var success = 0;
        var failure = 0;
        ell.setFireEventsSuccessCallback(function () { return success++; });
        ell.setFireEventsFailureCallback(function () { return failure++; });
        ell.addListener(function (evt) { return evt.chance; });
        ell.fireEvent({ name: "1", chance: 0.1 });
        ell.fireEvent({ name: "3", chance: 0.3 });
        ell.fireEvent({ name: "1", get chance() { throw new Error("event 3 failure"); } });
        asr.equal(success, 2);
        asr.equal(failure, 1);
    });
});
