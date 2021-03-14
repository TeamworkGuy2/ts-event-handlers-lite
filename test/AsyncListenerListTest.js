"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Q = require("q");
var AsyncListenerList = require("../AsyncListenerList");
var asr = chai.assert;
suite("AsyncListenerList", function AsyncListenerListTest() {
    var createListenerList = function () { return new AsyncListenerList({
        defer: Q.defer,
        all: Q.all,
    }); };
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
        var listenerA = function a() { aC++; };
        var listenerB = function b() { bC++; };
        var listenerC = function c() { cC++; };
        ell.setListenerAddedCallback(function () { return added++; });
        ell.setListenerRemovedCallback(function () { return removed++; });
        ell.addListener(listenerA);
        ell.addListener(listenerB);
        asr.deepEqual(ell.getListeners().sort(sortNames), [listenerA, listenerB]);
        ell.removeListener(listenerA);
        ell.addListener(listenerC);
        asr.deepEqual(ell.getListeners().sort(sortNames), [listenerB, listenerC]);
        asr.equal(added, 3);
        asr.equal(removed, 1);
    });
    test("fireEvents", function fireEventsTest(cb) {
        var ell = createListenerList();
        var success = 0;
        var failure = 0;
        var lC = 0;
        ell.setFireEventsSuccessCallback(function () { return success++; });
        ell.setFireEventsFailureCallback(function () { return failure++; });
        ell.addListener(function (dfd, evt) { lC++; dfd.resolve(evt.chance); });
        ell.fireEvent({ name: "a1", chance: 0.1 });
        ell.fireEvent({ name: "a2", get chance() { throw new Error("event a3 failure"); } });
        ell.fireEvent({ name: "a3", chance: 0.3 });
        setTimeout(function () {
            asr.equal(lC, 3);
            asr.equal(success, 2);
            asr.equal(failure, 1);
            cb();
        }, 100);
    });
});
