TS Event Handlers Lite
==============

Dependencies:
Q.js (if using AsyncEventListenerList.ts)

Utility classes for event listener management. 
Includes event listener lists (synchronous and asynchronous), queue (buffer multiple events before firing them), and singular event handler that waits for a single event before informing listeners and informing all subsequently attached listeners immediately (similar to jquery.ready(...)). 
See the /test directory for example usage of the functions in this project. 

####events
* AsyncEventListenerList - handle a list of asynchronous event listeners and wait for each of them to complete when events are fired
* EventListenerList - a standard synchronous event listener list, when an event is fired, call each of the listeners and pass event failures to an option failure listener, also allows event addition/removal meta listeners
* EventQueue - an event listener list which can queue up events and fire them in the order they were generated at a later time
* events.d.ts - typescript interfaces and types
* SingularEventHandler - an event listener list which waits for a single event and calls all listeners once when the event occurs, any listeners registered after the event occurs are invoked immediately
