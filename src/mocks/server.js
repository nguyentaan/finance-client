// import { setupWorker } from 'msw/browser';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
// export const server = setupWorker(...handlers);

// Start and stop the server in the appropriate lifecycle methods
if (typeof window === 'undefined') {
  // Running in Node.js environment
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
