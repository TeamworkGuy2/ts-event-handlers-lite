"use strict";
/// <reference path="./events.d.ts" />
var AsyncListenerList = require("./AsyncListenerList");
var EventQueue = require("./EventQueue");
var ListenerList = require("./ListenerList");
var SingularEventHandler = require("./SingularEventHandler");
var all = AsyncListenerList;
var eq = EventQueue;
var ll = ListenerList;
var seh = SingularEventHandler;
/** EventHandlersLite - contains static sub-modules for event/listener handling, including:
 * - AsyncListenerList: a set of listener functions which accept event objects along with a new Q.Deferred object and resolve/reject the deferred when the listener code is done running
 * - EventQueue: a generic event queue object with queueEvent() and fireExistingEvents() functions
 * - ListenerList: manages a list of listener functions and allows events to be sent to the listeners
 * - SingularEventHandler: an event handler that handles a single event, i.e. similar to jquery.ready(...), the event happens once and listeners are only called once.
 */
var EventHandlersLite;
(function (EventHandlersLite) {
    EventHandlersLite.AsyncListenerList = all;
    EventHandlersLite.EventQueue = eq;
    EventHandlersLite.ListenerList = ll;
    EventHandlersLite.SingularEventHandler = seh;
})(EventHandlersLite || (EventHandlersLite = {}));
module.exports = EventHandlersLite;
