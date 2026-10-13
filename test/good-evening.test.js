'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const serverPath = path.join(__dirname, '..', 'server.js');
const baseUrl = 'http://127.0.0.1:3000';
const readinessLine = 'Server running at http://127.0.0.1:3000/';
const readinessTimeoutMs = 5000;

let child;
let stdout = '';
let stderr = '';

test.before(async () => {
  child = spawn(process.execPath, [serverPath], { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`server did not print its readiness line within ${readinessTimeoutMs}ms\nstdout:\n${stdout}\nstderr:\n${stderr}`));
    }, readinessTimeoutMs);

    const onStdout = (chunk) => {
      stdout += chunk;
      if (stdout.includes(readinessLine)) {
        clearTimeout(timer);
        child.stdout.off('data', onStdout);
        child.off('exit', onExit);
        resolve();
      }
    };

    // A server that never binds (EADDRINUSE, for instance) must fail the run with its
    // own stderr instead of hanging until the readiness timer fires.
    const onExit = (code, signal) => {
      clearTimeout(timer);
      child.stdout.off('data', onStdout);
      reject(new Error(`server exited before printing its readiness line (code ${code}, signal ${signal})\nstdout:\n${stdout}\nstderr:\n${stderr}`));
    };

    child.stdout.on('data', onStdout);
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('exit', onExit);
  });
});

test.after(async () => {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  // The exit promise comes first: signalling without awaiting the exit can leave a
  // node server.js process holding port 3000 into the next run, which then fails
  // with EADDRINUSE.
  const exited = new Promise((resolve) => child.once('exit', resolve));
  child.kill('SIGTERM');
  await exited;
});

test('GET /good-evening returns 200 with Content-Type text/plain', async () => {
  const res = await fetch(`${baseUrl}/good-evening`);

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/plain');
});

test('GET /good-evening body is exactly "Good evening"', async () => {
  const res = await fetch(`${baseUrl}/good-evening`);

  assert.equal(await res.text(), 'Good evening');
  assert.equal(res.headers.get('content-length'), '12');
});

test('GET /hello-world is unchanged', async () => {
  const res = await fetch(`${baseUrl}/hello-world`);

  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), null);
  assert.equal(res.headers.get('content-length'), '14');
  assert.equal(await res.text(), 'Hello, World!\n');
});

test('server starts without errors with both endpoints registered', async () => {
  assert.ok(stdout.includes(readinessLine), `stdout must contain the readiness line\nstdout:\n${stdout}\nstderr:\n${stderr}`);

  const [goodEvening, helloWorld] = await Promise.all([
    fetch(`${baseUrl}/good-evening`),
    fetch(`${baseUrl}/hello-world`)
  ]);

  assert.equal(goodEvening.status, 200);
  assert.equal(helloWorld.status, 200);
});
