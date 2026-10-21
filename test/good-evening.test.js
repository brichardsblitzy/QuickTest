// Executable specification of the HTTP contract served by server.js.
//
// The server is spawned and addressed over HTTP rather than required: server.js exports nothing and
// stays export-free, so the wire is the only surface this file can assert on. The body literals below
// are therefore deliberate local copies, each compared byte-for-byte against what the server returns.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const serverPath = path.join(__dirname,'..','server.js');
const port = 3000;
const readinessLine = 'Server running at http://127.0.0.1:3000/';
const PRESERVED_BODY = 'Hello, World!\n';
const PRESERVED = Buffer.from(PRESERVED_BODY);
const EVENING_BODY = 'Good evening';
const READINESS_TIMEOUT_MS = 5000;

let child = null;

// Resolves once the spawned server has gone and released the fixed port 3000, so the next run can
// bind it. Safe to call twice: the child reference is cleared only after the close is observed, so a
// second call waits for the same exit instead of returning while the child is still running.
function stopServer(){
  const proc = child;
  if(!proc||proc.exitCode!==null||proc.signalCode!==null){
    child = null;
    return Promise.resolve();
  }
  return new Promise((resolve)=>{
    proc.once('close',()=>{
      child = null;
      resolve();
    });
    proc.kill('SIGTERM');
  });
}

function startServer(){
  return new Promise((resolve,reject)=>{
    const proc = spawn(process.execPath,[serverPath]);
    child = proc;
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timer = null;
    const settle = (error)=>{
      if(settled){
        return;
      }
      settled = true;
      clearTimeout(timer);
      if(error){
        reject(error);
      } else {
        resolve();
      }
    };
    // The wait is bounded: a second listener on the fixed port 3000 exits at once with EADDRINUSE, so
    // an unbounded wait would hang instead of surfacing the child's real error.
    timer = setTimeout(async ()=>{
      const stopped = stopServer();
      settle(new Error('server was not ready within ' + READINESS_TIMEOUT_MS + ' ms; stderr: ' + stderr));
      await stopped;
    },READINESS_TIMEOUT_MS);
    proc.stdout.on('data',(chunk)=>{
      stdout += chunk.toString();
      if(stdout.includes(readinessLine)){
        settle();
      }
    });
    proc.stderr.on('data',(chunk)=>{
      stderr += chunk.toString();
    });
    proc.on('error',(error)=>{
      settle(new Error('server could not be started: ' + error.message));
    });
    proc.on('close',(code,signal)=>{
      settle(new Error('server exited before readiness with code ' + code + ' and signal ' + signal + '; stderr: ' + stderr));
    });
  });
}

// Each request opens its own connection, and the body is kept as a Buffer so assertions compare bytes
// rather than normalised text.
function request(method,urlPath){
  return new Promise((resolve,reject)=>{
    const req = http.request({ host:'127.0.0.1', port:port, path:urlPath, method:method, agent:false },(res)=>{
      const chunks = [];
      res.on('data',(chunk)=>{
        chunks.push(chunk);
      });
      res.on('end',()=>{
        resolve({ status:res.statusCode, headers:res.headers, body:Buffer.concat(chunks) });
      });
      res.on('error',reject);
    });
    req.on('error',reject);
    req.end();
  });
}

before(async ()=>{
  await startServer();
});

after(async ()=>{
  await stopServer();
});

test('GET /good-evening returns 200 with Content-Type text/plain and the exact body',async ()=>{
  const response = await request('GET','/good-evening');
  assert.strictEqual(response.status,200,'status for GET /good-evening');
  assert.strictEqual(response.headers['content-type'],'text/plain','content-type for GET /good-evening');
  assert.strictEqual(response.headers['content-length'],'12','content-length for GET /good-evening');
  assert.strictEqual(response.body.toString(),EVENING_BODY,'body for GET /good-evening');
  assert.strictEqual(response.body.length,12,'body length in bytes for GET /good-evening');
});

test('GET /hello-world still returns the preserved response unchanged',async ()=>{
  const response = await request('GET','/hello-world');
  assert.strictEqual(response.status,200,'status for GET /hello-world');
  assert.strictEqual(response.headers['content-type'],undefined,'content-type for GET /hello-world');
  assert.strictEqual(response.headers['content-length'],'14','content-length for GET /hello-world');
  assert.deepStrictEqual(response.body,PRESERVED,'body for GET /hello-world');
});

test('every other request keeps the preserved response unchanged',async ()=>{
  const paths = ['/','/hello-world','/good-evening/','/good-evening?x=1','/any/other/path'];
  const methods = ['GET','POST','PUT','DELETE','PATCH','OPTIONS'];
  for(const method of methods){
    for(const urlPath of paths){
      const label = method + ' ' + urlPath;
      const response = await request(method,urlPath);
      assert.strictEqual(response.status,200,'status for ' + label);
      assert.strictEqual(response.headers['content-type'],undefined,'content-type for ' + label);
      assert.strictEqual(response.headers['content-length'],'14','content-length for ' + label);
      assert.deepStrictEqual(response.body,PRESERVED,'body for ' + label);
    }
  }
  const head = await request('HEAD','/hello-world');
  assert.strictEqual(head.status,200,'status for HEAD /hello-world');
  assert.strictEqual(head.headers['content-type'],undefined,'content-type for HEAD /hello-world');
  assert.strictEqual(head.headers['content-length'],undefined,'content-length for HEAD /hello-world');
  assert.strictEqual(head.body.length,0,'body length in bytes for HEAD /hello-world');
});

test('one server start serves both endpoints',async ()=>{
  const evening = await request('GET','/good-evening');
  assert.strictEqual(evening.status,200,'status for GET /good-evening');
  assert.strictEqual(evening.body.toString(),EVENING_BODY,'body for GET /good-evening');
  assert.strictEqual(evening.body.length,12,'body length in bytes for GET /good-evening');
  const hello = await request('GET','/hello-world');
  assert.strictEqual(hello.status,200,'status for GET /hello-world');
  assert.strictEqual(hello.body.length,14,'body length in bytes for GET /hello-world');
  assert.deepStrictEqual(hello.body,PRESERVED,'body for GET /hello-world');
});
