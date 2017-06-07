import chai = require("chai");
import mocha = require("mocha");
import ListenerList = require("../ListenerList");
import EventQueue = require("../EventQueue");

var asr = chai.assert;


suite("EventQueue", function EventQueueTest() {

    var createListenerList = () => ListenerList.newInst<{ chance: number; name: string }>();


    test("queueAndFire", function queueAndFireTest() {
        var list = createListenerList();
        var queue = new EventQueue(list, (evt) => { });

        var events: any[] = [];
        queue.getEventHandler().addListener((evt) => events.push(evt));

        queue.queueEvent({ name: "first", chance: 0.0 });

        asr.equal(queue.hasQueuedEvents(), true);
        asr.equal(events.length, 0);

        queue.queueAndFireEvent({ name: "second", chance: 0.1 });

        asr.equal(events.length, 2);

        queue.queueAndFireEvent({ name: "third", chance: 1 });

        asr.equal(events.length, 3);

        queue.queueEvent({ name: "fourth", chance: 2 });
        queue.reset();

        asr.equal(queue.hasQueuedEvents(), false);
        asr.equal(events.length, 3);
    });


    test("fireExistingEvents", function queueAndFireTest() {
        var list = createListenerList();
        var queue = new EventQueue(list, (evt) => { });

        var events: any[] = [];
        queue.getEventHandler().addListener((evt) => events.push(evt));

        queue.fireExistingEvents();

        asr.equal(events.length, 0);

        queue.queueEvent({ name: "1", chance: 0 });

        asr.equal(events.length, 0);

        var fired = false;
        queue.fireExistingEvents(() => { fired = true; });

        asr.equal(fired, true);
        asr.equal(events.length, 1);
    });

});