# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.2.9](N/A) - 2019-11-08
#### Changed
* Update to TypeScript 3.7


--------
### [0.2.8](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/30c04638a44cd505980dbbae7cd899564c365478) - 2019-07-06
#### Changed
* Update to TypeScript 3.5


--------
### [0.2.7](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/6c732fef9ded62c5538dc992c2826d68b513b8a8) - 2018-12-29
#### Changed
* Update to TypeScript 3.2
* Update @types dependencies
* Remove `tsconfig.json lib "dom"` option since only usage was `console` which is also available in Node.js environments


--------
### [0.2.6](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/ede94040fe6a8dceadbe3958c51641a05b7ad92f) - 2018-10-13
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable `tsconfig.json` `strict` option and add explicit constructor property initialization to fix compile errors
* Removed compiled bin tarball in favor of git tags and github releases


--------
### [0.2.5](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/35e6fd5b5828b6d1ac6e735f8513c7e3c010a211) - 2018-04-14
#### Added
* Added index.[ts|js] to follow standard npm package format, this file exports all the other classes.

#### Changed
* Added release tarball and npm script `build-package` to package.json referencing external process to generate tarball


--------
### [0.2.4](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/8ff5b57780be2661b07ea5c31a93fb344e6c4242) - 2018-03-31
#### Changed
* Update to TypeScript 2.8
* Update dependencies: @types/mocha, @types/q, and other minor version bumps
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`


--------
### [0.2.3](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/e94e881f0d98b46be6a341134a475d127773ec9e) - 2018-03-01
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha


--------
### [0.2.2](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/36bef027629a680fa0be54d596032c14307ff44a) - 2017-11-17
#### Changed
* `tsconfig.json` added `strictNullChecks`, `noImplicitAny`, and `noImplicitThis` and setup code to support null types.


--------
### [0.2.1](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/1e369d0e1abdec53b6859bac15871554fd1455b7) - 2017-08-05
#### Changed
* Update to TypeScript 2.4


--------
### [0.2.0](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/9c3f1cb78d9ca60d80d2c9998bb22e29ff4557bb) - 2017-06-07
#### Added
* EventQueueTest and some additional ListenerListTest test code

#### Changed
* Renamed AsyncEventListenerList -> AsyncListenerList
* Renamed EventListenerList -> ListenerList
  * Renamed ListenerList.queueChangeEvent() -> queueEvent()
  * Renamed ListenerList.queueAndFireChangeEvent() -> queueAndFireEvent()
* Renamed test file EventListenerListTest -> ListenerListTest


--------
### [0.1.2](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/3a64640c2779ba1fa50663cb7ea616d646c43ad0) - 2017-05-09
#### Changed
* Updated documentation to work with Visual Studio
* Update to TypeScript 2.3, add tsconfig.json, use @types/ definitions


--------
### [0.1.1](https://github.com/TeamworkGuy2/ts-event-handlers-lite/commit/b4f2dd8b94bf3abbc9e4fdfd2cbfd54f39b0e72f) - 2017-04-02
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
