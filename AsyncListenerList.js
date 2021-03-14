"use strict";
var ListenerList = require("./ListenerList");
/** An event listener list for asynchronous event listeners (i.e. the listeners perform asynchronous operations).
 * Manages a list of listener functions and allows events to be sent to the listeners.
 * When a listener is called, the event and a new Q.Deferred is passed to the function and the function resolves/rejects the deferred.
 */
var AsyncListenerList = /** @class */ (function () {
    function AsyncListenerList(promiseStatic) {
        this.eventHandler = new ListenerList();
        this.promiseStatic = promiseStatic;
    }
    AsyncListenerList.prototype.reset = function () {
        this.eventHandler.reset();
    };
    // have to proxy all the methods because TypeScript 'extends ...' doesn't work with our gulp compilation process
    AsyncListenerList.prototype.getListeners = function () {
        return this.eventHandler.getListeners();
    };
    AsyncListenerList.prototype.getFireEventsSuccessCallback = function () {
        return this.eventHandler.getFireEventsSuccessCallback();
    };
    AsyncListenerList.prototype.setFireEventsSuccessCallback = function (cb) {
        this.eventHandler.setFireEventsSuccessCallback(cb);
    };
    AsyncListenerList.prototype.getFireEventsFailureCallback = function () {
        return this.eventHandler.getFireEventsFailureCallback();
    };
    AsyncListenerList.prototype.setFireEventsFailureCallback = function (cb) {
        this.eventHandler.setFireEventsFailureCallback(cb);
    };
    AsyncListenerList.prototype.getListenerAddedCallback = function () {
        return this.eventHandler.getListenerAddedCallback();
    };
    AsyncListenerList.prototype.setListenerAddedCallback = function (cb) {
        this.eventHandler.setListenerAddedCallback(cb);
    };
    AsyncListenerList.prototype.getListenerRemovedCallback = function () {
        return this.eventHandler.getListenerRemovedCallback();
    };
    AsyncListenerList.prototype.setListenerRemovedCallback = function (cb) {
        this.eventHandler.setListenerRemovedCallback(cb);
    };
    AsyncListenerList.prototype.addListener = function (listener) {
        this.eventHandler.addListener(listener);
    };
    AsyncListenerList.prototype.addOneTimeListener = function (listener) {
        this.eventHandler.addOneTimeListener(listener);
    };
    AsyncListenerList.prototype.addNTimeListener = function (removeAfterNCalls, listener) {
        this.eventHandler.addNTimeListener(removeAfterNCalls, listener);
    };
    AsyncListenerList.prototype.removeListener = function (listener) {
        this.eventHandler.removeListener(listener);
    };
    AsyncListenerList.prototype.removeListenerAt = function (index) {
        this.eventHandler.removeListenerAt(index);
    };
    /**
     * @param event: the event object being fired to listeners
     */
    AsyncListenerList.prototype.fireEvent = function (event) {
        var promiseImpl = this.promiseStatic;
        var fireEventsSuccessCallback = this.getFireEventsSuccessCallback();
        var fireEventsFailureCallback = this.getFireEventsFailureCallback();
        var dfds = [];
        this.eventHandler.fireEvent(event, function asyncListenerCaller(listener, event, index, size) {
            var dfd = promiseImpl.defer();
            dfds.push(dfd.promise);
            listener(dfd, event[0]);
        }, function asyncListenerAwaiter() {
            promiseImpl.all(dfds).then(function (results) {
                if (typeof fireEventsSuccessCallback === "function") {
                    fireEventsSuccessCallback(results);
                }
            }).catch(function (err) {
                if (typeof fireEventsFailureCallback === "function") {
                    fireEventsFailureCallback(err);
                }
                else {
                    throw new Error(err);
                }
            });
        });
    };
    return AsyncListenerList;
}());
module.exports = AsyncListenerList;
