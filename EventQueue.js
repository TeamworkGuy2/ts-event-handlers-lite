"use strict";
/** A generic event queue object with queueEvent() and fireExistingEvents() functions
 * @author TeamworkGuy2
 * @param <E> the event type
 * @param <L> the listener function signature
 */
var EventQueue = /** @class */ (function () {
    function EventQueue(eventHandler, eventValidator) {
        this.tempEventCount = 0;
        this.events = [];
        var that = this;
        function fireEventsSuccess(results) {
            that.tempEventCount--;
            if (that.tempEventCount === 0 && that.tempDoneCb != null) {
                that.tempDoneCb();
                that.tempDoneCb = null;
            }
        }
        function fireEventsFailure(error) {
            that.tempEventCount--;
            if (that.tempEventCount === 0 && that.tempErrorCb != null) {
                that.tempErrorCb();
                that.tempErrorCb = null;
            }
        }
        this.eventHandler = eventHandler;
        this.tempDoneCb = null;
        this.tempErrorCb = null;
        /** callback functions that are called when eventHandler finish fireEvent() */
        this.eventHandler.setFireEventsSuccessCallback(fireEventsSuccess);
        this.eventHandler.setFireEventsFailureCallback(fireEventsFailure);
        this.eventValidator = eventValidator || null;
        this.getEventHandler = this.getEventHandler.bind(this);
        this.queueEvent = this.queueEvent.bind(this);
        this.fireExistingEvents = this.fireExistingEvents.bind(this);
    }
    EventQueue.prototype.reset = function () {
        if (this.hasQueuedEvents()) {
            console.error("reseting event queue with events still in queue", this.events);
        }
        var successCb = this.eventHandler.getFireEventsSuccessCallback();
        var failureCb = this.eventHandler.getFireEventsFailureCallback();
        this.events = [];
        this.eventHandler.reset();
        this.eventHandler.setFireEventsSuccessCallback(successCb);
        this.eventHandler.setFireEventsFailureCallback(failureCb);
    };
    /** @return this event queue's event handler */
    EventQueue.prototype.getEventHandler = function () {
        return this.eventHandler;
    };
    EventQueue.prototype.hasQueuedEvents = function () {
        return this.events.length > 0;
    };
    /**
     * @see #queueEvent
     * @see #fireExistingEvents
     */
    EventQueue.prototype.queueAndFireEvent = function (event, doneCb) {
        this.queueEvent(event);
        this.fireExistingEvents(doneCb);
    };
    /** Add an event to this event queue's list of current events, the event is fired after any
     * currently pending events and before any future events are fired using this function.
     * However, none of these calls are made until 'fireExistingEvents()' is called
     */
    EventQueue.prototype.queueEvent = function (event) {
        if (event == null) {
            throw new Error("cannot queue null event");
        }
        if (this.eventValidator != null) {
            var res = this.eventValidator(event);
            if (res === false) {
                return;
            }
        }
        this.events.push(event);
    };
    /** Fire all current events in this event queue and call 'doneCb' when
     * all the event listeners have completed
     */
    EventQueue.prototype.fireExistingEvents = function (doneCb) {
        this.tempDoneCb = doneCb;
        this.tempEventCount = this.events.length;
        while (this.events.length > 0) {
            var event = this.events.shift();
            this.getEventHandler().fireEvent(event);
        }
    };
    return EventQueue;
}());
module.exports = EventQueue;
