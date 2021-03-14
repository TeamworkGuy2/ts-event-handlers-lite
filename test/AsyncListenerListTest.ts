declare var setTimeout: (func: () => void, timeoutMillis: number) => number;
import chai = require("chai");
import mocha = require("mocha");
import Q = require("q");
import AsyncListenerList = require("../AsyncListenerList");

var asr = chai.assert;

suite("AsyncListenerList", function AsyncListenerListTest() {

    var createListenerList = () => new AsyncListenerList<{ chance: number; name: string }>({
        defer: <any>Q.defer,
        all: <any>Q.all,
    });

    var sortNames = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);


    test("addListenerAndFireEvents", function addListenerAndFireEventsTest() {
        var ell = createListenerList();
        var all = 0;
        var once = 0;
        var twice = 0;
        var thrice = 0;
        ell.addListener(() => all++);
        ell.addOneTimeListener(() => once++);
        ell.addNTimeListener(2, () => twice++);
        ell.addNTimeListener(3, () => thrice++);

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

        ell.setListenerAddedCallback(() => added++);
        ell.setListenerRemovedCallback(() => removed++);

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
        ell.setFireEventsSuccessCallback(() => success++);
        ell.setFireEventsFailureCallback(() => failure++);

        ell.addListener((dfd, evt) => { lC++; dfd.resolve(evt.chance); });

        ell.fireEvent({ name: "a1", chance: 0.1 });
        ell.fireEvent({ name: "a2", get chance(): number { throw new Error("event a3 failure"); } });
        ell.fireEvent({ name: "a3", chance: 0.3 });

        setTimeout(function () {
            asr.equal(lC, 3);
            asr.equal(success, 2);
            asr.equal(failure, 1);
            cb();
        }, 100);
    });

});
