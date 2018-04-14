/// <reference path="./events.d.ts" />

import AsyncListenerList = require("./AsyncListenerList");
import EventQueue = require("./EventQueue");
import ListenerList = require("./ListenerList");
import SingularEventHandler = require("./SingularEventHandler");

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
module EventHandlersLite {

    export var AsyncListenerList = all;

    export var EventQueue = eq;

    export var ListenerList = ll;

    export var SingularEventHandler = seh;

}

export = EventHandlersLite;
