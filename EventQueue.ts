
declare var console: { log(...msgs: any[]): void; error(...msgs: any[]): void };

/** A generic event queue object with queueEvent() and fireExistingEvents() functions
 * @author TeamworkGuy2
 * @param <E> the event type
 * @param <L> the listener function signature
 */
class EventQueue<E, L extends (...args: any[]) => void> implements Events.EventQueue<E, L> {
    eventHandler: Events.ListenerList<E, L>;
    /** callbacks to call when fireExistingEventsSuccess or fireExistingEventsFailure run */
    tempDoneCb: (() => void) | null;
    tempErrorCb: (() => void) | null;
    tempEventCount: number = 0;
    events: E[] = [];
    eventValidator: ((event: E) => boolean | void) | null;


    constructor(eventHandler: Events.ListenerList<E, L>, eventValidator?: (event: E) => boolean | void) {
        var that = this;

        function fireEventsSuccess(results: any) {
            that.tempEventCount--;
            if (that.tempEventCount === 0 && that.tempDoneCb != null) {
                that.tempDoneCb();
                that.tempDoneCb = null;
            }
        }

        function fireEventsFailure(error: any) {
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


    public reset() {
        if (this.hasQueuedEvents()) {
            console.error("reseting event queue with events still in queue", this.events);
        }
        var successCb = <(res: any[]) => void>this.eventHandler.getFireEventsSuccessCallback();
        var failureCb = <(err: any) => void>this.eventHandler.getFireEventsFailureCallback();
        this.events = [];
        this.eventHandler.reset();
        this.eventHandler.setFireEventsSuccessCallback(successCb);
        this.eventHandler.setFireEventsFailureCallback(failureCb);
    }


    /** @return this event queue's event handler */
    public getEventHandler(): Events.ListenerList<E, L> {
        return this.eventHandler;
    }


    public hasQueuedEvents(): boolean {
        return this.events.length > 0;
    }


    /**
     * @see #queueEvent
     * @see #fireExistingEvents
     */
    public queueAndFireEvent(event: E, doneCb?: () => void) {
        this.queueEvent(event);
        this.fireExistingEvents(doneCb);
    }


    /** Add an event to this event queue's list of current events, the event is fired after any
     * currently pending events and before any future events are fired using this function.
     * However, none of these calls are made until 'fireExistingEvents()' is called
     */
    public queueEvent(event: E) {
        if (event == null) { throw new Error("cannot queue null event"); }
        if (this.eventValidator != null) {
            var res = <boolean><any>this.eventValidator(event);
            if (res === false) {
                return;
            }
        }
        this.events.push(event);
    }


    /** Fire all current events in this event queue and call 'doneCb' when
     * all the event listeners have completed
     */
    public fireExistingEvents(doneCb?: () => void) {
        this.tempDoneCb = <(() => void) | null>doneCb;
        this.tempEventCount = this.events.length;
        while (this.events.length > 0) {
            var event = <E>this.events.shift();
            this.getEventHandler().fireEvent(event);
        }
    }

}

export = EventQueue;
