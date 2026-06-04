/**
 * A Custom Redux/Flux-like Dispatcher for the Frontend.
 */
class Dispatcher {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.handlers = {};
    }

    register(type, handlerFn) {
        this.handlers[type] = handlerFn;
    }

    dispatch({ type, payload }) {
        if (!this.handlers[type]) {
            // Some events might not need handlers yet, or are handled elsewhere
            return;
        }

        // Push to queue instead of executing immediately
        this.queue.push({ type, payload });

        if (!this.isProcessing) {
            this.processNext();
        }
    }

    /**
     * Sequentially processes events in the queue.
     * Uses async/await to delay events until the previous event ends.
     */
    async processNext() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const { type, payload } = this.queue.shift();

        try {
            const handler = this.handlers[type];
            // Await the handler so animations/timeouts can finish before the next event
            await handler(payload);
        } catch (e) {
            console.error(`[Dispatcher] Error processing action [${type}]:`, e);
        }

        // Process the next item in the queue recursively
        this.processNext();
    }
}

export const dispatcher = new Dispatcher();
