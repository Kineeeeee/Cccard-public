import { state } from "../state/state.js";
import { dispatcher } from "../dispatcher/Dispatcher.js";
import { initDispatcher } from "../dispatcher/index.js";

export const socket = io();

// Initialize the dispatcher mapping
initDispatcher();

// Forward all incoming socket events from the server directly to our Redux-style Dispatcher.
// This is the core of our unidirectional data flow architecture. 
// Instead of handling UI logic here, we just throw the raw event into the queue.
socket.onAny((eventName, ...args) => {
    dispatcher.dispatch({
        type: eventName,
        payload: args.length > 1 ? args : args[0],
    });
});

state.userId = localStorage.getItem("userId");

if (!state.userId) {
    state.userId = crypto.randomUUID();
    localStorage.setItem("userId", state.userId);
}
