import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Set up the service worker with the defined handlers
export const worker = setupWorker(...handlers);

// Start the worker
worker.start();