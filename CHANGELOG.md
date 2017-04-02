# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.1.1](N/A) - 2017-04-02
#### Fixed
* Fixed an issue with EventQueue not calling fireEventSuccess/Failure callbacks after reset() was called.


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/36bd418777a7cd77e77a9200ccc69dd322fc5100) - 2016-09-19
Split from [ts-mortar](https://github.com/TeamworkGuy2/ts-mortar)@[0.10.2](https://github.com/TeamworkGuy2/ts-mortar/commit/1ad592bb8ff59ad31a74cdcb19199aa2ff7b1d11) library
#### Added
Initial commit including:
* AsyncEventListenerList.ts - handle a list of asynchronous event listeners
* EventListenerList.ts - a standard synchronous event listener list
* EventQueue.ts - an event listener list which can queue up events
* events.d.ts - typescript interfaces and types
* SingularEventHandler.ts - an event listener list which waits for a single event similar to jquery.ready()
