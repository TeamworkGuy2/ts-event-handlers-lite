"use strict";
/** A listener/event handler class - manages a list of listener functions and allows events to be sent to the listeners
 * @author TeamworkGuy2
 * @param <E> the event type
 * @param <L> the listener function signature
 */
var EventListenerList = (function () {
    function EventListenerList() {
        this.reset();
    }
    EventListenerList.prototype.reset = function () {
        this.listeners = [];
        this.listenerCallsUntilRemoval = [];
        this.fireEventsSuccessCallback = null;
        this.fireEventsFailureCallback = null;
        this.listenerAddedCallback = null;
        this.listenerRemovedCallback = null;
    };
    EventListenerList.prototype.getListeners = function () {
        return this.listeners;
    };
    EventListenerList.prototype.getFireEventsSuccessCallback = function () {
        return this.fireEventsSuccessCallback;
    };
    EventListenerList.prototype.setFireEventsSuccessCallback = function (cb) {
        EventListenerList.checkCallback(cb, "fire events success");
        this.fireEventsSuccessCallback = cb;
    };
    EventListenerList.prototype.getFireEventsFailureCallback = function () {
        return this.fireEventsFailureCallback;
    };
    EventListenerList.prototype.setFireEventsFailureCallback = function (cb) {
        EventListenerList.checkCallback(cb, "fire events failure");
        this.fireEventsFailureCallback = cb;
    };
    EventListenerList.prototype.getListenerAddedCallback = function () {
        return this.listenerAddedCallback;
    };
    EventListenerList.prototype.setListenerAddedCallback = function (cb) {
        EventListenerList.checkCallback(cb, "fire events success");
        this.listenerAddedCallback = cb;
    };
    EventListenerList.prototype.getListenerRemovedCallback = function () {
        return this.listenerRemovedCallback;
    };
    EventListenerList.prototype.setListenerRemovedCallback = function (cb) {
        EventListenerList.checkCallback(cb, "fire events success");
        this.listenerRemovedCallback = cb;
    };
    /** Add a listener function that is called whenever a new customer is added to the bid via the UI
     * @param listener a listener function that is passed the new customer added to the bid
     */
    EventListenerList.prototype.addListener = function (listener) {
        this.addNTimeListener(-1, listener);
    };
    EventListenerList.prototype.addOneTimeListener = function (listener) {
        this.addNTimeListener(1, listener);
    };
    /** Add a listener which is removed after a certain number of calls
     * @param removeAfterNCalls the number of times to call this listener before removing it, -1 indicates infinite
     * @param listener the listener function
     */
    EventListenerList.prototype.addNTimeListener = function (removeAfterNCalls, listener) {
        if (typeof listener !== "function") {
            throw new Error("cannot add listener " + listener);
        }
        if (!Number.isInteger(removeAfterNCalls)) {
            throw new Error("cannot add listener with non-integer number of calls before removal '" + removeAfterNCalls + "'");
        }
        this.listeners.push(listener);
        this.listenerCallsUntilRemoval.push(removeAfterNCalls);
        if (this.listenerAddedCallback) {
            this.listenerAddedCallback(listener);
        }
    };
    /** Remove a listener function from being called whenever a new customer is added to a bid via the UI
     * @param listener a listener function that was previously registered with this GenericEventListenerHandler via 'addListener(listener)'
     */
    EventListenerList.prototype.removeListener = function (listener) {
        if (typeof listener !== "function") {
            throw new Error("cannot remove listener " + listener);
        }
        var index = this.listeners.indexOf(listener);
        if (index > -1 && index < this.listeners.length) {
            this.removeListenerAt(index);
        }
    };
    EventListenerList.prototype.removeListenerAt = function (index) {
        var listener = this.listeners[index];
        EventListenerList.fastRemoveIndex(this.listeners, index);
        EventListenerList.fastRemoveIndex(this.listenerCallsUntilRemoval, index);
        if (this.listenerRemovedCallback) {
            this.listenerRemovedCallback(listener);
        }
    };
    /**
     * @param event: the event to pass to the event listener functions
     * @param customListenerCaller: a function call that takes a listener and event and should fire that event to the listener,
     * overrides this handler default behavior 'listener.apply(thisArg, args)'
     * @param customListenerCallsDoneCb: if provided, a function to call when all the listeners have been called, in place of 'this.fireEventsSuccessCallback'
     */
    EventListenerList.prototype.fireEvent = function (event, customListenerCaller, customListenerCallsDoneCb) {
        var that = this;
        var errorOccurred = false;
        var useCustomCaller = (typeof customListenerCaller === "function");
        function callListenerProxy(listener, thisArg, args, k, size) {
            var res = null;
            try {
                if (useCustomCaller) {
                    res = customListenerCaller(listener, args, k, size);
                }
                else {
                    res = listener.apply(thisArg, args);
                }
            }
            catch (err) {
                errorOccurred = true;
                if (typeof that.fireEventsFailureCallback === "function") {
                    that.fireEventsFailureCallback(err);
                }
                else {
                    throw new Error(err);
                }
            }
            return res;
        }
        var params = [event];
        var results = [];
        for (var listenerCount = that.listeners.length, i = listenerCount - 1; i > -1; i--) {
            var listener = that.listeners[i];
            var remainingCallCount = that.listenerCallsUntilRemoval[i];
            if (remainingCallCount > 0) {
                that.listenerCallsUntilRemoval[i]--;
                remainingCallCount--;
            }
            var res = null;
            if (typeof listener === "function") {
                res = callListenerProxy(listener, undefined, params, i, listenerCount);
                if (errorOccurred) {
                    break;
                }
            }
            results.push(res);
            if (remainingCallCount === 0) {
                that.removeListenerAt(i);
            }
        }
        if (typeof customListenerCallsDoneCb === "function") {
            customListenerCallsDoneCb(event);
        }
        else {
            if (!errorOccurred && typeof that.fireEventsSuccessCallback === "function") {
                that.fireEventsSuccessCallback(results);
            }
        }
    };
    /** Check if a function argument is a non-null function */
    EventListenerList.checkCallback = function (cb, msg) {
        if (typeof cb !== "function") {
            throw new Error(msg + " callback '" + cb + "' must be a function");
        }
    };
    // ==== Copied from 'ts-mortar' Arrays.ts ====
    /** Remove a value at a specific index from an array without creating a new array of splicing the array.
     * NOTE: the returned order of the array's elements is not defined.
     * @param ary: the array of values to remove the index value from
     * @param index: the index of the value to remove from the array
     * @return 'ary' of values with the specified index removed
     */
    EventListenerList.fastRemoveIndex = function (ary, index) {
        var aryLen = ary != null ? ary.length : 0;
        if (aryLen === 0) {
            return ary;
        }
        if (aryLen > 1) {
            ary[index] = ary[aryLen - 1];
        }
        ary.pop();
        return ary;
    };
    EventListenerList.newInst = function () {
        return new EventListenerList();
    };
    return EventListenerList;
}());
module.exports = EventListenerList;