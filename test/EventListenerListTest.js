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
        asr.equal(all, 5);
        asr.equal(once, 1);
        asr.equal(twice, 2);
        asr.equal(thrice, 3);
    });
    test("addAndRemoveListener", function addAndRemoveListenerTest() {
        var ell = createListenerList();
        var aC = 0;
        var bC = 0;
        var cC = 0;
        var lstA = function a() { aC++; };
        var lstB = function b() { bC++; };
        var lstC = function c() { cC++; };
        ell.addListener(lstA);
        ell.addListener(lstB);
        asr.deepEqual(ell.getListeners().sort(sortNames), [lstA, lstB]);
        ell.removeListener(lstA);
        ell.addListener(lstC);
        asr.deepEqual(ell.getListeners().sort(sortNames), [lstB, lstC]);
    });
});
