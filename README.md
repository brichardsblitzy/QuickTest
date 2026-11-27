# QuickTest

A minimal Node.js HTTP server: a `Hello, World` smoke-test fixture with no domain logic.

Run it with `node server.js`.

No package manifest exists, so there is no `npm start` and nothing to install; the only dependency is Node's built-in `http` module, loaded with CommonJS `require`.

On start it binds TCP port 3000 on all interfaces and logs `Server running at http://127.0.0.1:3000/` once; the port is hardcoded, so no environment variable or argument changes it.

Every request, whatever the method and path, gets HTTP 200 with the plain-text body `Hello, World!` followed by a newline; there is no routing, no request parsing, no error handling, and no Content-Type header.
