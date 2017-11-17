import Q = require("q");
import ListenerList = require("./ListenerList");

/** An event listener list for asynchronous event listeners (i.e. the listeners perform asynchronous operations)
 * manages a list of listener functions and allows events to be sent to the listeners
 */
class AsyncListenerList<E> implements Events.ListenerList<E, Events.AsyncListener<E>> {
    private eventHandler: ListenerList<E, Events.AsyncListener<E>>;

    constructor() {
        this.eventHandler = new ListenerList<E, Events.AsyncListener<E>>();
    }

    public reset() {
        this.eventHandler.reset();
    }

    // have to proxy all the methods because TypeScript 'extends ...' doesn't work with our gulp compilation process
    public getListeners(): Events.AsyncListener<E>[] {
        return this.eventHandler.getListeners();
    }

    public getFireEventsSuccessCallback(): ((res: any[]) => void) | null {
        return this.eventHandler.getFireEventsSuccessCallback();
    }

    public setFireEventsSuccessCallback(cb: (res: any[]) => void) {
        this.eventHandler.setFireEventsSuccessCallback(cb);
    }

    public getFireEventsFailureCallback(): ((err: any) => void) | null {
        return this.eventHandler.getFireEventsFailureCallback();
    }

    public setFireEventsFailureCallback(cb: (err: any) => void) {
        this.eventHandler.setFireEventsFailureCallback(cb);
    }

    public getListenerAddedCallback(): ((listener: Events.AsyncListener<E>) => void) | null {
        return this.eventHandler.getListenerAddedCallback();
    }

    public setListenerAddedCallback(cb: (listener: Events.AsyncListener<E>) => void) {
        this.eventHandler.setListenerAddedCallback(cb);
    }

    public getListenerRemovedCallback(): ((listener: Events.AsyncListener<E>) => void) | null {
        return this.eventHandler.getListenerRemovedCallback();
    }

    public setListenerRemovedCallback(cb: (listener: Events.AsyncListener<E>) => void) {
        this.eventHandler.setListenerRemovedCallback(cb);
    }

    public addListener(listener: Events.AsyncListener<E>) {
        this.eventHandler.addListener(listener);
    }

    public addOneTimeListener(listener: Events.AsyncListener<E>) {
        this.eventHandler.addOneTimeListener(listener);
    }

    public addNTimeListener(removeAfterNCalls: number, listener: Events.AsyncListener<E>) {
        this.eventHandler.addNTimeListener(removeAfterNCalls, listener);
    }

    public removeListener(listener: Events.AsyncListener<E>) {
        this.eventHandler.removeListener(listener);
    }

    public removeListenerAt(index: number) {
        this.eventHandler.removeListenerAt(index);
    }


    /**
     * @param event: the event object being fired to listeners
     */
    public fireEvent(event: E, customListenerCaller?: (listener: Events.AsyncListener<E>, args: [E], index: number, total: number) => any, customListenerCallsDoneCb?: (event: E) => void) {
        var fireEventsSuccessCallback = this.getFireEventsSuccessCallback();
        var fireEventsFailureCallback = this.getFireEventsFailureCallback();
        var dfds: Q.Promise<any>[] = [];

        this.eventHandler.fireEvent(event, function asyncListenerCaller(listener, event, index, size) {
            var dfd = Q.defer<any>();
            dfds.push(dfd.promise);
            listener(dfd, event[0]);
        }, function asyncListenerAwaiter() {
            Q.all(dfds).done(function (results) {
                if (typeof fireEventsSuccessCallback === "function") {
                    fireEventsSuccessCallback(results);
                }
            }, function (err) {
                if (typeof fireEventsFailureCallback === "function") {
                    fireEventsFailureCallback(err);
                }
                else {
                    throw new Error(err);
                }
            });
        });

    }

}

export = AsyncListenerList;
