const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');

// server.js exports nothing, so it is observed as the running process it is, spawned below.
const SERVER_PATH = path.join(__dirname,'..','server.js');
const HOST = '127.0.0.1';
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;
const READY_LINE = 'Server running at http://127.0.0.1:3000/';
const GOOD_EVENING_PATH = '/good-evening';
const GOOD_EVENING_BODY = 'Good evening';
const GOOD_EVENING_CONTENT_TYPE = 'text/plain';
const PRESERVED_PATH = '/hello-world';
const ROOT_PATH = '/';
const PRESERVED_BODY = 'Hello, World!\n';
const PRESERVED_LENGTH = '14';
const STARTUP_TIMEOUT_MS = 10000;
const POLL_INTERVAL_MS = 50;
const PROBE_TIMEOUT_MS = 2000;
const REQUEST_TIMEOUT_MS = 2000;
const CASE_TIMEOUT_MS = 8000;

let server = null;
let serverStdout = '';
let serverStderr = '';
let lastProbeError = null;

function sleep(ms) {
  return new Promise((resolve)=>setTimeout(resolve,ms));
}

function hasExited(child) {
  return child.exitCode!==null || child.signalCode!==null;
}

async function isServing(budgetMs) {
  try {
    const res = await fetch(BASE_URL+ROOT_PATH,{ signal: AbortSignal.timeout(budgetMs) });
    await res.text();
    return true;
  } catch (err) {
    lastProbeError = err;
    return false;
  }
}

async function waitForReady() {
  const deadline = Date.now()+STARTUP_TIMEOUT_MS;
  while (Date.now()<deadline) {
    if (hasExited(server)) {
      throw new Error(`server.js exited before serving a request (exit code ${server.exitCode}, signal ${server.signalCode}); stderr: ${serverStderr}`);
    }
    const budget = Math.max(1,Math.min(PROBE_TIMEOUT_MS,deadline-Date.now()));
    if (serverStdout.includes(READY_LINE) && await isServing(budget)) {
      return;
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`server.js was not ready within ${STARTUP_TIMEOUT_MS} ms; last probe error: ${lastProbeError===null?'none':lastProbeError}; stderr: ${serverStderr}`);
}

async function request(pathname) {
  try {
    const res = await fetch(BASE_URL+pathname,{ signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    return { res, body: await res.text() };
  } catch (err) {
    throw new Error(`request to ${pathname} failed: ${err}`);
  }
}

before(async ()=>{
  server = spawn(process.execPath,[SERVER_PATH],{stdio:['ignore','pipe','pipe']});
  server.stdout.setEncoding('utf8');
  server.stderr.setEncoding('utf8');
  server.stdout.on('data',(chunk)=>{ serverStdout += chunk; });
  server.stderr.on('data',(chunk)=>{ serverStderr += chunk; });
  await waitForReady();
},{ timeout: 30000 });

after(async ()=>{
  if (server===null || hasExited(server)) {
    return;
  }
  const exited = new Promise((resolve)=>{ server.once('exit',resolve); });
  server.kill();
  await exited;
},{ timeout: 15000 });

test('GET /good-evening returns 200',{ timeout: CASE_TIMEOUT_MS },async ()=>{
  const { res, body } = await request(GOOD_EVENING_PATH);
  assert.strictEqual(res.status,200);
  assert.strictEqual(body,GOOD_EVENING_BODY);
  assert.strictEqual(res.headers.get('content-type'),GOOD_EVENING_CONTENT_TYPE);
});

test('GET /good-evening body is exactly "Good evening"',{ timeout: CASE_TIMEOUT_MS },async ()=>{
  const { res, body } = await request(GOOD_EVENING_PATH);
  assert.strictEqual(body,GOOD_EVENING_BODY);
  assert.strictEqual(Buffer.byteLength(body,'utf8'),12);
  assert.strictEqual(res.headers.get('content-type'),GOOD_EVENING_CONTENT_TYPE);
});

test('GET /hello-world is unchanged',{ timeout: CASE_TIMEOUT_MS },async ()=>{
  const { res, body } = await request(PRESERVED_PATH);
  assert.strictEqual(res.status,200);
  assert.strictEqual(body,PRESERVED_BODY);
  assert.strictEqual(res.headers.get('content-type'),null);
  assert.strictEqual(res.headers.get('content-length'),PRESERVED_LENGTH);
});

test('GET / is unchanged',{ timeout: CASE_TIMEOUT_MS },async ()=>{
  const { res, body } = await request(ROOT_PATH);
  assert.strictEqual(res.status,200);
  assert.strictEqual(body,PRESERVED_BODY);
  assert.strictEqual(res.headers.get('content-type'),null);
  assert.strictEqual(res.headers.get('content-length'),PRESERVED_LENGTH);
});

test('server starts without errors with both routes registered',{ timeout: CASE_TIMEOUT_MS },async ()=>{
  assert.strictEqual(serverStdout.trim(),READY_LINE);
  assert.strictEqual(serverStderr,'');
  assert.strictEqual(server.exitCode,null);
  assert.strictEqual(server.signalCode,null);
  const goodEvening = await request(GOOD_EVENING_PATH);
  const preserved = await request(PRESERVED_PATH);
  assert.strictEqual(goodEvening.res.status,200);
  assert.strictEqual(preserved.res.status,200);
});
