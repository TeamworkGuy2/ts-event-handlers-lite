/// <reference types="q" />

declare module Events {

    export interface Listener<E> {
        (event: E): void;
    }


    export interface AsyncListener<E> {
        (promise: Q.Deferred<any>, event: E): void;
    }


    /** A generic event queue object with queueEvent() and fireExistingEvents() functions
     */
    interface EventQueue<E, L extends (...args: any[]) => void> {
        /** temporary callbacks to call when fireExistingEventsSuccess or fireExistingEventsFailure run */
        tempDoneCb: (() => void) | null;
        tempErrorCb: (() => void) | null;
        tempEventCount: number;
        events: E[];
        eventValidator: ((event: E) => boolean | void) | null;

        //new (eventHandler: EventQueue<E, L>, eventValidator?: (event: E) => void): GenericEventQueue<E, L>;

        reset(): void;

        /** @return this event queue's event handler */
        getEventHandler(): ListenerList<E, L>;

        hasQueuedEvents(): boolean;

        /**
         * @see #queueEvent
         * @see #fireExistingEvents
         */
        queueAndFireEvent(event: E, doneCb?: () => void): void;

        /** Add an event to this change handler's queue of current events, the event is fired after any
         * currently pending events and before any future events are fired using this function.
         * However, none of these calls are made until 'fireExistingEvents()' is called
         */
        queueEvent(event: E): void;

        /** Fire all current events in this event queue and call 'doneCb' when
         * all the event listeners have completed
         */
        fireExistingEvents(doneCb?: () => void): void;
    }


    /** A listener/event handler class - manages a list of listener functions and allows events to be sent to the listeners
     */
    interface ListenerList<E, L extends (...args: any[]) => void> {

        reset(): void;

        getListeners(): L[];

        getFireEventsSuccessCallback(): ((res: any[]) => void) | null;

        setFireEventsSuccessCallback(cb: (res: any[]) => void): void;

        getFireEventsFailureCallback(): ((err: any) => void) | null;

        setFireEventsFailureCallback(cb: (err: any) => void): void;

        getListenerAddedCallback(): ((listener: L) => void) | null;

        setListenerAddedCallback(cb: (listener: L) => void): void;

        getListenerRemovedCallback(): ((listener: L) => void) | null;

        setListenerRemovedCallback(cb: (listener: L) => void): void;

        /** Add a listener function that is called whenever a new customer is added to the bid via the UI
         * @param listener a listener function that is passed the new customer added to the bid
         */
        addListener(listener: L): void;

        addOneTimeListener(listener: L): void;

        addNTimeListener(removeAfterNCalls: number, listener: L): void;

        /** Remove a listener function from being called whenever a new customer is added to a bid via the UI
         * @param listener a listener function that was previously registered with this ListenerList via 'addListener(listener)'
         */
        removeListener(listener: L): void;

        removeListenerAt(index: number): void;

        /**
         * @param event: the event to pass to the event listener functions
         * @param customListenerCaller a function call that takes a listener and event and should fire that event to the listener,
         * overrides this handler default behavior 'listener.apply(thisArg, args)'
         * @param customListenerCallsDoneCb: a function to call when all the listeners have been called
         */
        fireEvent(event: E, customListenerCaller?: (listener: L, args: [E], index: number, total: number) => any, customListenerCallsDoneCb?: (event: E) => void): void;

    }

}
