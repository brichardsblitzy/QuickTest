# 1. Executive Summary

This project is a bounded, additive change to a one-file Node.js service: a second HTTP route and the one dependency that hosts it. It is delivered and verified. One piece of written documentation still describes the service as it was before the change, and that is the only work outstanding.

## 1.1 Project Overview

The single-route Node.js server is now a two-route Express application held in the same one-line file, `server.js`. `GET /good-evening` answers `200`, `text/plain; charset=utf-8`, the exact 13-byte body `Good evening`. `GET /` answers `200` with the byte-identical 14-byte `Hello, World!` and still no `Content-Type`. `express` is the only new package, declared in a three-key root manifest, `package.json`; the service still starts as `node server.js`, binds port 3000 and prints one startup line. Apart from those two files the repository holds only this guide and the technical specification under `blitzy/documentation/`: no tests, no configuration layer, no lockfile.

## 1.2 Completion Status

```mermaid
%%{init: {"themeVariables": {"pie1": "#5B39F3", "pie2": "#FFFFFF", "pieStrokeColor": "#B23AF2", "pieTitleTextSize": "14px", "pieLegendTextSize": "12px"}}}%%
pie title Project completion: 95.3% (30.5 h delivered of 32.0 h)
    "Completed Work" : 30.5
    "Remaining Work" : 1.5
```

| Metric | Hours |
|---|---|
| Total Hours | 32.0 |
| Completed Hours (AI + Manual) | 30.5 |
| Remaining Hours | 1.5 |

**Completion = 30.5 ÷ (30.5 + 1.5) × 100 = 95.3%**, measured over the two mapped files plus the path needed to install, run and verify them.

## 1.3 Key Accomplishments

- **`GET /good-evening`** — `200`, `text/plain; charset=utf-8`, exactly 13 bytes (`server.js:1`).
- **`GET /` unchanged** — `200`, 14 bytes, still no `Content-Type`, same handler expression.
- **One dependency** — `express ^5.0.0` resolves to 5.3.0 from the manifest alone, with no lockfile.
- **Truthful startup** — one 41-byte line, printed only once the port is bound; a failed bind prints nothing and exits 1.
- **Framework defaults elsewhere** — unmatched paths and unregistered methods take the default `404`; `HEAD` and `OPTIONS` answer as the framework serves them.
- **Hostile input inert** — 24 traversal, CRLF, script, malformed and oversized probes: no `5xx`, no injected header, no reflected markup.
- **Environment-free and quiet** — no environment read (`PORT` is ignored) and no per-request logging after 100+ requests.
- **Shape as specified** — one statement on one line, three manifest keys, and no lockfile, ignore file, test artefact, handler or hardening.

## 1.4 Critical Unresolved Issues

**2 of 28 open** — one documentation edit a maintainer must make, and the platform decisions the agreed scope deliberately leaves outside the code.

| Issue | Impact | Owner | ETA |
|---|---|---|---|
| The technical specification under `blitzy/documentation/` still describes the earlier single-route `node:http` server — "one 142-character line", zero dependencies, no manifest — and shows the startup callback in `.listen`'s argument position in 11 places, which `server.js:1` no longer uses. | Documentation drift only. The delivered code is correct as it stands: its startup form is what makes a failed bind exit 1 instead of printing readiness. A maintainer editing the file to match that specification literally would reinstate the defect. | Repository owner | 1.5 h |
| Deployment prerequisites the agreed scope excludes from the code: a pinned dependency set, a port and transport posture for the fixed literal `3000`, a readiness probe at the orchestrator instead of a log-line match, and a pinned Node runtime. | One instance per host on plaintext HTTP, with an unpinned 5.x dependency and no in-band health endpoint. Accepted caveat of the agreed scope, not a defect. | Deploying team | 6.5 h if all are approved (not counted in Remaining Hours) |

## 1.5 Access Issues

No access issues identified. The repository, the registry install and every command in Section 9 ran with no credential and no extra permission; the application reads nothing external.

## 1.6 Recommended Next Steps

1. **[High]** Bring the technical specification in line with the delivered two-route application and its startup form — 1.5 h.
2. **[Medium]** Settle the port and transport posture for deployment — 2.0 h.
3. **[Medium]** Probe `GET /` from the orchestrator for readiness, and pin the dependency set before the first production install — 1.5 h.
4. **[Low]** Scan the resolved dependency tree for advisories, pin the Node runtime and evaluate a fronting proxy — 3.0 h.

Step 1 is the 1.5 h in Section 2.2; steps 2–4 are the 6.5 h listed in Section 1.4.

# 2. Project Hours Breakdown

Hours cover the work this project was scoped to — the two mapped files plus the install-and-boot path needed to run them — and nothing outside it. Each row traces to a named requirement of the agreed scope.

## 2.1 Completed Work Detail

| Component | Hours | Description |
|---|---|---|
| Express conversion carrying the preserved `GET /` route | 2.5 | Replaces the `node:http` construct with a single chained Express statement on one line; the `/` handler, port literal and startup callback are carried over character for character, and nothing is renamed, re-indented or hoisted (`server.js:1`). |
| `GET /good-evening` route contract | 1.5 | Second registration returning `200`, `text/plain; charset=utf-8` and the 13-byte body `Good evening\n`, with the media type set before the body is sent. |
| Root manifest declaring the sole dependency | 1.0 | Three-key `package.json` (`quicktest`, `1.0.0`, `express ^5.0.0`) and nothing else; installed with `--no-package-lock` so no lockfile is produced (`package.json:1-7`). |
| Listener continuation: port 3000 and the startup line | 1.0 | The port literal and the 41-byte log text are unchanged; the line is emitted once per successful start and never at all otherwise. |
| Startup failure signalling | 1.5 | The startup callback is attached to the server's `listening` event, so no `error` listener is registered and a bind conflict surfaces on stderr with a non-zero exit instead of reporting readiness (`server.js:1`). |
| Startup and readiness verification | 1.5 | Log bytes, stream and count; no per-request logging under 100+ requests; no secret or request-derived value in either stream; absent health, metrics and tracing endpoints; failed-start runs. |
| Route-contract verification, byte-exact | 5.0 | Status, media type, exact body bytes and header set for both routes, plus method, path-variant, query, `Accept`, `HEAD` and idempotency behaviour against the live build. |
| Lifecycle, dispatch, concurrency and shutdown verification | 3.0 | Registration before the port opens, dispatch separation, interleaved and repeated requests, `SIGTERM`/`SIGINT`/`SIGHUP`, rapid rebind, second-instance bind conflict. |
| Configuration and dependency-resolution verification | 3.0 | Manifest key set, declared-versus-resolved version, install with no lockfile, fail-fast on a missing dependency, the port literal under ten environment-variable shapes. |
| Adversarial request-surface verification | 6.0 | SQL, command, traversal, null-byte, malformed-encoding and oversized payloads; reflected-script probes; CRLF and header injection; framing ambiguity; CORS, cookies and log integrity; availability under hostile bursts. |
| Whole-deliverable acceptance and tree-state verification | 3.0 | Both contracts re-confirmed on the shipped files, the failed-start path re-run, the framework-default surface enumerated, and the committed tree confirmed to hold exactly the two application files with no excluded artefact. |
| Conformance re-verification of the delivered tree | 1.5 | Every contract value, the manifest, the tree state and the startup failure path re-established against the files as shipped — 77 assertions in the current gate plus the wider contract and runtime sweeps behind it. |
| **Total** | **30.5** | Matches Completed Hours in Section 1.2. |

## 2.2 Remaining Work Detail

| Category | Hours | Priority |
|---|---|---|
| Documentation alignment: update the technical specification under `blitzy/documentation/` to describe the delivered two-route Express application — its overview, code block, dependency inventory and diagrams — and to state the startup form `server.js:1` actually uses, with the reason the positional form must not be restored. Documentation only; no code change. | 1.5 | High |
| **Total** | **1.5** | Matches Remaining Hours in Section 1.2 and "Remaining Work" in Section 7. |

No code work remains. A clean checkout installs from the manifest (express 5.3.0, no lockfile), boots with `node server.js`, serves both contracts byte-exactly, and fails honestly when the port is held or the dependency is missing; `node --check server.js` exits 0 and the committed tree holds the two application files and nothing else. The platform decisions the agreed scope places outside the code — a pinned dependency set, port and transport posture, an orchestrator-level readiness probe, a pinned Node runtime — are listed in Section 1.4 as accepted caveats and are deliberately not counted here.

# 3. Test Results

The repository carries no test framework, runner, coverage tool or linter, and the agreed scope forbids adding one. The gate that stands in for a suite is `node --check server.js` plus a boot-and-curl exercise of the live process. Every case below was executed against the files as they ship on Node v22.23.5 with Express 5.3.0. **77 cases executed, 77 passed, 0 failed.**

| Area / Category | Framework | Tests | Passed | Failed | Coverage | What This Proves |
|---|---|---|---|---|---|---|
| Startup, bind and readiness signalling | Boot-and-curl gate | 6 | 6 | 0 | n/a | The port is bound before anything is printed: the single 41-byte line appears only once the listener is up, and the listener belongs to the process that printed it. |
| Log and output surface | Boot-and-curl gate | 3 | 3 | 0 | n/a | stdout stays at the one startup line and stderr stays empty however much traffic the process serves. |
| Bind failure, signals and port release | Process-level runs | 6 | 6 | 0 | n/a | A held port ends the process with exit 1 and no readiness line while the incumbent keeps serving; a signal stops it and frees port 3000. |
| Route contract, both routes | Boot-and-curl gate | 19 | 19 | 0 | n/a | Both greetings are returned byte-exactly with the media types the contract fixes, `/` still carries no `Content-Type`, and repeated requests return identical bytes. |
| Framework defaults and hostile request surface | Boot-and-curl gate | 24 | 24 | 0 | n/a | Everything the contract does not name behaves as the framework default, and no payload is executed, injected into a header or reflected as raw markup. |
| Concurrency and statelessness | Boot-and-curl gate | 1 | 1 | 0 | n/a | 20 interleaved requests to both routes yield exactly two distinct bodies — nothing is carried between requests. |
| Configuration absence | Boot-and-curl gate | 4 | 4 | 0 | n/a | The listener ignores the environment: `PORT=4000` still binds 3000 and leaves 4000 refused. |
| Manifest, dependency resolution and tree state | Package and file checks | 14 | 14 | 0 | n/a | The manifest alone installs the one dependency, resolves 5.3.0 with no lockfile, and the tree holds exactly the two application files with every excluded artefact absent. |

**Not Covered**

- **No automated regression protection.** There is no suite to run, so everything above is a hand-executed gate against a live process. A future edit to `server.js:1` — swapping `res.end` for `res.send` on `/`, which would add the `Content-Type` header the contract requires to stay absent, or restoring the positional `.listen` callback, which would print readiness for a port it never acquired — is caught only by re-running the gate.
- **No coverage figures.** No instrumentation exists, so line and branch coverage cannot be stated for any file.
- **One runtime combination.** Verified on Node 22.23.5 with Express 5.3.0 only. Any other Node or Express version is unspecified and untested, and nothing in the repository pins either.
- **Sustained load and memory behaviour.** Bursts of up to 200 requests and 400 concurrent requests were exercised; soak behaviour over hours was not.
- **Transport and topology.** TLS, proxying and multi-instance deployment were not exercised. The second-instance case covers the bind conflict, not load balancing.
- **Caching and conditional requests.** Not exercised in the current gate; the framework adds a weak `ETag` to `/good-evening` and none to `/`.
- **Supply chain.** Advisory and CVE status of the resolved dependency tree was not assessed, because the agreed scope puts dependency research outside this change.
- **IPv6 loopback.** `[::1]` was unreachable in one sandbox that carried no IPv6 address; the pre-change build refuses it identically, so this is unchanged rather than independently verified behaviour.

# 4. Runtime Validation & UI Verification

The service has no user interface: two plain-text routes and a framework 404 page are the entire surface, so "UI verification" here means the one page a browser can be pointed at. Every line below was driven against the running process on the files as they ship.

- ✅ **Process start** — `node server.js` prints exactly one 41-byte line, `Server running at http://127.0.0.1:3000/`, on stdout with 0 bytes on stderr, and the listener answers as soon as the line appears.
- ✅ **`GET /`** — `200`, 14 bytes `Hello, World!\n` (`od -c` verified), zero `Content-Type` headers, `Content-Length: 14`, `X-Powered-By: Express` present.
- ✅ **`GET /good-evening`** — `200`, `Content-Type: text/plain; charset=utf-8`, 13 bytes, hex `47 6f 6f 64 20 65 76 65 6e 69 6e 67 0a`, weak `ETag`; `Accept: text/html` does not displace the media type.
- ✅ **Unmatched path and unregistered method** — Express's default `404` page (`Cannot GET /nope`); `POST`/`PUT`/`DELETE` on both paths `404`; the process keeps serving.
- ✅ **`HEAD` and `OPTIONS`** — `HEAD` `200` on both routes with the body stripped and the length header intact; `OPTIONS` answers `200` with `Allow: GET, HEAD`.
- ✅ **Start failures** — a held port exits `1` with 0 bytes on stdout and `EADDRINUSE` on stderr while the incumbent keeps serving; a missing dependency exits `1` before any port opens.
- ✅ **Environment ignored** — `PORT=4000` still binds 3000, leaves 4000 refused, and produces the same single startup line.
- ✅ **Hostile and crafted requests** — traversal, encoded traversal, CRLF in the request target and script-shaped paths all take the default 404 with the target percent-encoded in the body; no injected response header; malformed request line → `400`; 40 KB header → `431`.
- ✅ **Clean-manifest install and boot** — a directory holding only the two application files installs the declared dependency, writes no lockfile, and then serves both contracts.
- ✅ **Shutdown** — `SIGTERM` exits 143 and the port is released; no cleanup output is produced, because no shutdown handler exists.

**Never exercised at runtime:** TLS termination or any proxied hop; sustained soak beyond ~200-request bursts; any Node or Express version other than 22.23.5 and 5.3.0; `[::1]` loopback in an environment that has an IPv6 address; a health endpoint, which does not exist by design; and any UI beyond the framework's 404 page, because none exists.

# 5. Compliance & Quality Review

Each deliverable is judged against the benchmark it answers to, in the state it ships today.

## 5.1 Compliance Matrix

| # | Deliverable | Benchmark | Status | Progress |
|---|---|---|---|---|
| 1 | `GET /good-evening` returns the fixed status, media type and body | Functional correctness | ✅ Met — 200, `text/plain; charset=utf-8`, 13 bytes exactly | 100% |
| 2 | `GET /` unchanged: same status, same 14 bytes, still no `Content-Type` | Regression safety | ✅ Met — handler byte-identical; header set differs from the pre-change build only by `X-Powered-By` | 100% |
| 3 | One declared dependency, one import, names identical | Configuration hygiene | ✅ Met — `express` only, resolvable from the manifest, 5.3.0 resolved | 100% |
| 4 | Blast radius limited to the two mapped files | Change control | ✅ Met — `M server.js`, `A package.json`, nothing else created, modified or deleted | 100% |
| 5 | Smallest possible diff, existing style preserved | Maintainability | ✅ Met — one line out, one line in; no rename, re-indent or hoist | 100% |
| 6 | Manifest limited to name, version and the dependency; no lockfile | Configuration hygiene | ✅ Met — three keys, every forbidden field absent, no lockfile written or tracked | 100% |
| 7 | Every artefact the scope excludes stays absent | Scope control | ✅ Met — no tests, ignore file, lockfile, container or CI file | 100% |
| 8 | Startup is truthful: one line, only when the port is bound | Operability | ✅ Met — failed-start runs exit 1 with no line; the success path logs once | 100% |
| 9 | Security posture of a public, input-free read surface | Security | ✅ Met — no input reaches a sink; every adversarial probe refused or escaped | 100% |
| 10 | Every specified value proven against the running service | QA rigour | ✅ Met — 77 executed cases, all passing, across 8 verification areas | 100% |
| 11 | Dependency set reproducible across installs | Supply chain | ⚠ Met with caveat — `^5.0.0` floats to the newest 5.x by design; no lockfile may be committed | 100% of the agreed scope |
| 12 | The written specification and the shipped code agree | Documentation | ⚠ Met with caveat — the specification still describes the earlier single-route server and the positional bind form; Section 2.2 carries the 1.5 h alignment | 90% |

## 5.2 AAP & Rule Divergences and Gaps

| What the AAP/Rule Required | What Was Delivered Instead | Why It Diverged | Impact | Remediation |
|---|---|---|---|---|
| R13 — no dependency-version research or framework verification, and no measured requests. **Sanctioned.** | The application was booted and requested against directly: route bytes, headers, status codes and the failed-start path were measured on the live process. | The project's run requirements mandate a syntax check plus a boot-and-curl gate, and they rank above the plan-level rule; that gate cannot be satisfied without measured requests. Version research, registry lookups and trial installs were not performed, and `^5.0.0` remains the unverified assumption the specification recorded. | None adverse — the measured requests are what prove both contracts and the failed-start path. | None required. |
| R14 — no exhaustive repository scan or existence probe. **Sanctioned.** | The tree was probed for lockfiles, documentation, ignore, test and CI artefacts, and its tracked set was compared against the two mapped paths. | Proving that the excluded paths are genuinely absent requires probing the tree, and that check is part of the same mandated gate; the change itself was planned from one targeted read of the manifest path. | None adverse. | None required. |
| The specification's startup statement: `.listen(3000,()=>console.log('Server running at http://127.0.0.1:3000/'))`, as recorded in the technical specification under `blitzy/documentation/`. **Sanctioned.** | `server.js:1` binds the identical callback to the server's own event: `.listen(3000).once('listening',()=>console.log('Server running at http://127.0.0.1:3000/'))`. 18 bytes differ; the preserved prefix and the callback's characters are identical. | Express 5.3.0 rewrites a trailing function argument with `once()` and registers it as the server's one-shot `error` listener, so in the prescribed position a failed bind is consumed by a callback that discards it: the readiness line prints for a port that was never acquired and the process exits 0. The project's run requirements therefore fix the delivered form. | Contract text and code disagree on one 18-byte segment; behaviour, port, log bytes, routes and the one-line diff are exactly as specified. A maintainer following the written specification literally would reinstate the false-readiness defect. | Update the specification (1.5 h, Section 2.2). No code change is available: restoring the positional literal would reinstate the defect. |

**The startup statement — the divergence that needs a human decision.** `server.js:1` attaches the startup callback to the server's `listening` event rather than passing it in `.listen`'s argument position, the one place the shipped file departs from the specification's own text. Express 5.3.0 records a trailing function argument as the socket's one-shot error consumer, so in the prescribed position a failed bind is swallowed: the readiness line prints for a port never acquired and the process exits 0, which a supervisor reads as healthy. The delivered form surfaces `EADDRINUSE` on stderr, writes nothing to stdout and exits 1, while the success path emits the same 41 bytes once. Port, routes and the one-line diff are unchanged; bringing the specification up to the delivered form (1.5 h) closes it.

# 6. Risk Assessment

| Risk | Category | Severity | Probability | Mitigation | Status |
|---|---|---|---|---|---|
| The dependency range floats: with no lockfile, `express ^5.0.0` resolves to the newest 5.x at install time (5.3.0 today), so a future minor can change framework defaults the contract depends on — 404 page shape, `ETag` presence, default header set, charset handling — with no committed signal. | Technical / Integration | Medium | High | Pin and lock the dependency set in a change that lifts the no-lockfile constraint. | Open — accepted by the agreed scope |
| No automated regression net exists, and the written specification still shows the superseded positional bind, so an edit guided by it would restore readiness-on-failed-bind. | Technical | Medium | High | Re-run the Section 9 gate before every change; treat the absent `Content-Type` on `/` and the exit-1-with-no-line bind failure as invariants. | Open — one half is the 1.5 h documentation task in Section 2.2 |
| Port 3000 is a fixed literal and the listener binds every interface with no TLS, so one instance fits per host and confidentiality rests entirely on network placement. | Operational / Security | Medium | Medium | Map the port and choose reachable interfaces at the platform layer; terminate TLS in front of the service. | Open |
| There is no health or readiness endpoint; the single startup line is the only in-band signal, so a supervisor that matches text instead of probing the port has no independent check. | Operational | Low | Medium | Probe `GET /` from the orchestrator and ignore the log line for health decisions. | Open |
| No rate limiting, request timeout or header-size limit beyond the runtime's own defaults, so a client can request without bound or hold a connection with an incomplete header block. | Security / Operational | Medium | Low | Enforce limits at a fronting proxy; the application cannot carry them under the agreed scope. | Open |
| Per-response disclosure: `X-Powered-By: Express` on every reply, and the framework 404 echoes the requested path with its own policy headers. That echo is percent-encoded and HTML-escaped, and every crafted probe returned it inert. | Security | Low | Medium | Strip the header at the edge if the service is exposed; in-application suppression is out of scope. | Open — accepted by the agreed scope |
| The Node runtime is unpinned (no `engines` field, no `.nvmrc`), so a different runtime could change framework or parser defaults underneath the same dependency range. | Operational | Low | Low | Pin the runtime image at the platform layer. | Open — accepted by the agreed scope |
| No advisory or CVE assessment exists for the resolved dependency tree, because the agreed scope puts research outside the change; 65 transitive packages are installed unpinned. | Integration / Security | Medium | Low | Run a supply-chain scan outside this repository's gate, before the first production install. | Open |

# 7. Visual Project Status

```mermaid
%%{init: {"themeVariables": {"pie1": "#5B39F3", "pie2": "#FFFFFF", "pieStrokeColor": "#B23AF2", "pieTitleTextSize": "14px", "pieLegendTextSize": "12px"}, "pie": {"textPosition": 0.6}}}%%
pie title Project Hours Breakdown: 30.5 h completed, 1.5 h remaining (95.3%)
    "Completed Work" : 30.5
    "Remaining Work" : 1.5
```

```mermaid
%%{init: {"themeVariables": {"pie1": "#B23AF2", "pie3": "#A8FDD9", "pieStrokeColor": "#FFFFFF", "pieTitleTextSize": "14px", "pieLegendTextSize": "12px"}}}%%
pie title Remaining Hours by Priority
    "High — documentation alignment" : 1.5
```

| Measure | Value |
|---|---|
| Completed work | 30.5 h |
| Remaining work | 1.5 h |
| Total | 32.0 h |
| Completion | 95.3% |
| Open items | 2 of 28 |

*Brand key: Completed = Dark Blue `#5B39F3`; Remaining = White `#FFFFFF`; accents = Violet-Black `#B23AF2` and Mint `#A8FDD9`. Remaining hours are identical here, in Section 1.2 and in Section 2.2.*

# 8. Summary & Recommendations

**What was delivered.** The repository's single-route Node.js server is now a two-route Express application held in one statement on one line, with `express` declared as the sole dependency of a three-key root manifest. `GET /good-evening` returns `200`, `text/plain; charset=utf-8` and exactly 13 bytes; `GET /` still returns `200` and exactly 14 bytes with no `Content-Type`, produced by the same handler expression as before. The application still starts with `node server.js`, still binds port 3000, and still prints one 41-byte startup line — now only once the port is actually bound, so a failed start writes nothing to stdout, reports `EADDRINUSE` on stderr and exits non-zero.

**What was exercised to prove it.** 77 cases across eight areas, all passing: the two route contracts byte-for-byte (19), the framework defaults and hostile request surface (24), the manifest, dependency resolution and tree state (14), startup, bind and readiness (6), bind failure, signals and port release (6), configuration absence (4), the log and output surface (3), and concurrency and statelessness (1). No test framework, coverage tool or linter exists in the repository and none may be added, so this evidence is a hand-executed gate rather than an automated suite.

**Completion and what remains.** 30.5 hours of the 32.0 the project was scoped to are delivered — **95.3% complete** (30.5 ÷ 32.0). The 1.5 hours outstanding are documentation, not code: the technical specification under `blitzy/documentation/` still describes the earlier single-route `node:http` server and shows the startup callback in `.listen`'s argument position, while `server.js:1` attaches it to the server's `listening` event because the positional form reports readiness for a port it never acquired. Port, routes, log bytes and the one-line diff are unchanged, so bringing that document up to the delivered form is all that closes it.

**Critical path to production.** Install from the manifest and run `node server.js`; both are verified from a directory holding only the two files, so deployment itself has no outstanding work. What a deployment must decide lies outside the agreed scope of the code: pin the dependency set, map port 3000 and choose the reachable interfaces with TLS in front, probe `GET /` for readiness rather than matching the log line, and pin the Node runtime. Those four decisions, plus a supply-chain scan of the 65 installed packages, are the whole of the platform work and are listed in Section 1.4 as accepted caveats.

**Production readiness.** Ready for the scope it was built to: a two-route service that boots with `node server.js`, serves both contracts byte-exactly, signals readiness truthfully and exits non-zero on a failed bind or a missing dependency. It is not, and was not scoped to be, a hardened internet-facing service — header hardening, rate limiting, error and 404 handlers, an environment-configured port and a lockfile are all deliberately absent. Treat the risks in Section 6 as platform-layer responsibilities that accompany the deployment, not as gaps in the code.

# 9. Development Guide

Every command below was run from the repository root against the tree as it ships, and the output shown is what it produced.

### System prerequisites

- **Node.js** 22.23.5 with **npm** 11.21.0. The runtime must satisfy Express 5's own `>= 18` engine requirement; nothing else is pinned, because the manifest carries no `engines` field and no `.nvmrc`.
- **curl**, for the verification requests.
- No database, message broker, container runtime, VPN or cloud service. The application reads no environment variable and needs no secret, so there is nothing to configure before starting.
- About 10 MB of disk for the installed dependency tree (65 packages), which stays untracked.

### Environment setup and dependency installation

The application has one dependency, declared in `package.json` and installed from it. The install must be run without a lockfile: the repository deliberately commits none, and a plain `npm install` would write one and leave an untracked artefact behind.

```bash
cd <repository root>
node --version        # v22.23.5
npm --version         # 11.21.0
CI=true npm install --no-package-lock
```

Expected: exit 0, ending with a line such as `up to date in 256ms` on a second run (`added 65 packages` on a fresh checkout), then `found 0 vulnerabilities`. Confirm the resolved version and that no lockfile was written:

```bash
node -p "require('express/package.json').version"   # 5.3.0
ls package-lock.json                                # No such file or directory
```

`git status --porcelain` should show only `?? node_modules/`. Anything else — a lockfile, an ignore file, a test file — was not produced by this project and does not belong in the change.

### Application startup

```bash
node --check server.js     # exit 0, no output
node server.js
```

Expected output, exactly one line on stdout and nothing on stderr:

```text
Server running at http://127.0.0.1:3000/
```

The process runs in the foreground and serves until it receives a signal. To run it in the background while checking it, redirect its output to a file of your choosing in the repository root and delete that file afterwards, since no ignore file exists to hide it:

```bash
node server.js > server.log 2>&1 &
```

### Verification steps

```bash
# 1. The preserved route: 14 bytes, and no Content-Type header
curl -s http://127.0.0.1:3000/ | od -c
# 0000000   H   e   l   l   o   ,       W   o   r   l   d   !  \n
# 0000016
curl -s -D - -o /dev/null http://127.0.0.1:3000/ | grep -ci '^content-type'   # 0

# 2. The new route: 200, text/plain; charset=utf-8, 13 bytes
curl -s -D - http://127.0.0.1:3000/good-evening
# HTTP/1.1 200 OK
# X-Powered-By: Express
# Content-Type: text/plain; charset=utf-8
# Content-Length: 13
# ETag: W/"d-7fFyiNLFhmJrNT+BforqesSHNow"
curl -s http://127.0.0.1:3000/good-evening | od -An -tx1
#  47 6f 6f 64 20 65 76 65 6e 69 6e 67 0a

# 3. Anything else is the framework's 404
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/does-not-exist   # 404

# 4. HEAD is answered by the framework on both routes
curl -s -I -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/              # 200
curl -s -I -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/good-evening   # 200

# 5. The process logs once and never per request
wc -lc server.log     # 1  41   (after all of the requests above)
```

### Example usage

Two plain-text greetings over HTTP; nothing is sent in the request that changes the response.

```bash
curl -i http://127.0.0.1:3000/
```

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Length: 14
Date: ...
Connection: keep-alive
Keep-Alive: timeout=5

Hello, World!
```

```bash
curl -i http://127.0.0.1:3000/good-evening
```

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 13
ETag: W/"d-7fFyiNLFhmJrNT+BforqesSHNow"
Date: ...
Connection: keep-alive
Keep-Alive: timeout=5

Good evening
```

The `X-Powered-By`, `ETag` and `Date` headers are the framework's own and are left in place deliberately. The asymmetry between the two responses is intended: `/` writes its body with `res.end` and therefore carries no `Content-Type`, while `/good-evening` sets its media type before sending.

### Failure behaviour

Both failure modes are verified and intentional.

```bash
# Port already in use: exit 1, nothing on stdout, EADDRINUSE on stderr
node server.js > out.log 2> err.log; echo "exit=$?"    # exit=1
wc -c out.log                                          # 0
head -3 err.log
# node:events:497
#       throw er; // Unhandled 'error' event
#       ^
# Error: listen EADDRINUSE: address already in use :::3000
rm -f out.log err.log
```

```bash
# Dependency missing: exit 1, nothing on stdout, no port ever opened
mv node_modules/express node_modules/express.parked    # park the installed dependency
node server.js > d_out.log 2> d_err.log; echo "exit=$?" # exit=1
wc -c d_out.log                                        # 0
head -2 d_err.log
# node:internal/modules/cjs/loader:1433
#   throw err;
# Error: Cannot find module 'express'
mv node_modules/express.parked node_modules/express    # restore it
rm -f d_out.log d_err.log
node -p "require('express/package.json').version"      # 5.3.0
```

### Troubleshooting

| Symptom | Cause | Resolution |
|---|---|---|
| `EADDRINUSE ... :::3000` and exit 1 | Another process already listens on 3000; the port is a fixed literal with no override. | Find the holder and stop only that process. `lsof`, `ss`, `netstat` and `fuser` may not be installed: read the listening inode for port `0BB8` from `/proc/net/tcp` and `/proc/net/tcp6` (state `0A`), then match `socket:[inode]` under `/proc/*/fd` to identify the pid and its working directory. |
| The port answers but the log file stays empty | Another checkout's identical process holds 3000 and answered instead. | Check the socket owner's working directory under `/proc/<pid>/cwd`; stop your own instance and wait for the port, never kill one you do not own. |
| `Cannot find module 'express'` | The dependency was never installed, or `node_modules` was moved. | Run `CI=true npm install --no-package-lock`. The process fails before opening a port, so this is safe to fix and restart. |
| `npm install` writes `package-lock.json` | The install was run without `--no-package-lock`. | Delete the lockfile and re-install with the flag; it must not be committed. |
| `git status` shows unexpected untracked files | No `.gitignore` exists by design. | Stage only `server.js` and `package.json`; leave `node_modules/`, log files and any local script untracked. |
| The process dies with exit 143 / 130 / 129 | `SIGTERM` / `SIGINT` / `SIGHUP`. There is no shutdown handler, so termination is immediate and the port is released. | Expected. Restart with `node server.js`; a rebind succeeds within ~100 ms. |
| A request hangs with headers incomplete | No request timeout or header limit is configured beyond the runtime's defaults. | Expected under the agreed scope. Enforce limits at a proxy if the service is exposed. |
| You want to run tests or a linter | Neither exists, and the scope forbids adding one. | Use the gate above: `node --check server.js`, one boot, the verification requests, and the two failure runs. |

# 10. Appendices

Reference material for operating and changing this service.

## A. Command Reference

| Purpose | Command | Expected |
|---|---|---|
| Check syntax | `node --check server.js` | exit 0, no output |
| Install the dependency without a lockfile | `CI=true npm install --no-package-lock` | exit 0, 65 packages, `found 0 vulnerabilities`, no lockfile |
| Resolved dependency version | `node -p "require('express/package.json').version"` | `5.3.0` |
| Declared range | `node -p "require('./package.json').dependencies.express"` | `^5.0.0` |
| Start the service | `node server.js` | one line: `Server running at http://127.0.0.1:3000/` |
| Start in the background | `node server.js > server.log 2>&1 &` | same line, written to `server.log` |
| Preserved route | `curl -s http://127.0.0.1:3000/` | `Hello, World!` + LF, 14 bytes |
| New route | `curl -s http://127.0.0.1:3000/good-evening` | `Good evening` + LF, 13 bytes |
| Response headers | `curl -s -D - -o /dev/null http://127.0.0.1:3000/` | 200, no `Content-Type`, `X-Powered-By: Express` |
| Unmatched path | `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/nope` | `404` |
| Log volume | `wc -lc server.log` | `1 41` regardless of traffic |
| Stop your own listener | `kill <pid>` | exit 143 for `SIGTERM`; the port is released |
| Find a listener when `lsof` is absent | `awk 'NR>1{split($2,a,":"); if (a[2]=="0BB8" && $4=="0A") print $10}' /proc/net/tcp /proc/net/tcp6` | the socket inode; match `socket:[inode]` under `/proc/*/fd` for the pid |
| Confirm a clean tree | `git status --porcelain` | only `?? node_modules/` |

## B. Port Reference

| Port | Protocol | Owner | Notes |
|---|---|---|---|
| 3000 | HTTP (plaintext) | `server.js:1` — the fixed literal in `.listen(3000)` | Hardcoded; no environment variable or configuration file can change it. Binds a dual-stack wildcard socket, so it is reachable on every interface while the startup line advertises `http://127.0.0.1:3000/`. |
| 3000 | — | any other process on the same host | The service has no fallback: if the port is taken, the process exits 1 with `EADDRINUSE` and prints no readiness line. One instance per host. |

No other socket is opened. The process creates no outbound connection, no data-store connection and no child process.

## C. Key File Locations

| Path | Lines / bytes | Role |
|---|---|---|
| `server.js` | 1 line / 238 bytes | The whole application: `require('express')()` creates the app, `.get('/')` registers the preserved route, `.get('/good-evening')` registers the new one, `.listen(3000)` binds the port, and `.once('listening', …)` logs the startup line. |
| `package.json` | 7 lines / 97 bytes | The manifest: `name` `quicktest`, `version` `1.0.0`, `dependencies` holding `express` at `^5.0.0` — and nothing else. |
| `node_modules/` | 65 packages, untracked | Installed dependency tree. Never committed; no `.gitignore` exists, so exclusion is by omission from staging. |
| `blitzy/documentation/` | 2 files, tracked | This guide and the technical specification. The specification predates the change and still describes the earlier single-route server — Section 2.2 carries the alignment task. |

Nothing else belongs in the tree: no `app.js`, `routes/`, `src/`, test, fixture, `README.md`, `.gitignore`, lockfile, container file or CI workflow. The two application files plus those two documents are the entire repository.

## D. Technology Versions

| Component | Version | Notes |
|---|---|---|
| Node.js | 22.23.5 | The runtime verified against this build. Unpinned in the repository: no `engines` field, no `.nvmrc`. |
| npm | 11.21.0 | Used with `--no-package-lock` so no lockfile is produced. |
| Express | 5.3.0 resolved from `^5.0.0` | The only dependency. The resolved version floats to the newest 5.x on each install; the range is not pinned and no lockfile records what was tested. |
| Installed package count | 65 | The single direct dependency plus its transitive tree, all untracked. |
| Plain Node HTTP server (replaced) | built in | The pre-change build used `require('http').createServer(...)`; the request handler, port and startup text were carried into the Express form unchanged. |
| curl | host default | Used for every verification request. |

## E. Environment Variable Reference

The application reads **no environment variable**. There is no `.env` file, no dotenv loader, no feature flag and no secrets layer; `grep process.env server.js` returns nothing.

| Variable | Effect on this service | Evidence |
|---|---|---|
| `PORT` | None. The port is the literal `3000`: started with `PORT=4000`, the process binds 3000, answers there, and leaves 4000 refusing connections, with the same single startup line. Ten further shapes — `4123`, empty, `abc`, `0`, whitespace-padded, `99999`, `4123:4123`, 5000 characters, one containing a newline, and combined with `NODE_ENV` — behaved identically. | Verified live |
| `NODE_ENV` | None observable. With `production` set, the listener, the startup line and both responses are identical; the framework's own error page is the only surface that could differ, and it is not exercised by either route. | Verified live |
| `APP_ENV`, `CONFIG` | None. No configuration file is read, so a value here selects nothing. | Verified live |
| `NODE_PATH` | Not used by the application. A decoy copy of the dependency planted on `NODE_PATH` cannot displace the checkout's own `node_modules/express`. | Verified live |

Adding an environment-driven port, a log level or any other runtime setting would be a change to the agreed scope, not a configuration of it.

## F. Developer Tools Guide

| Tool | Available | Use in this project |
|---|---|---|
| `node --check` | Built in | The only static gate. Exit 0 means the single statement parses. |
| `npm` | 11.21.0 | Installs the one dependency; `npm ls --depth=0` lists exactly one top-level package. |
| `curl` | Host default | Every verification request: bodies, headers, status codes, `HEAD`, and the failed-start checks. |
| `/proc/net/tcp`, `/proc/net/tcp6`, `/proc/*/fd` | Kernel | The supported way to find which process holds port 3000 when `lsof`, `ss` and `netstat` are absent. |
| `od`, `wc`, `cmp` | Coreutils | Byte-level verification of both bodies and the startup line (`wc -c`, `od -An -tx1`). |
| Test framework | **None** | No runner, harness, fixture or collection exists, and none may be added. The gate is the boot-and-curl sequence in Section 9. |
| Linter / formatter | **None** | No ESLint, Prettier or TypeScript configuration exists; single quotes, no spaces inside parentheses and one statement per file are maintained by hand. |
| Coverage tool | **None** | No instrumentation; coverage cannot be measured for this codebase. |
| Security scanner | **None** | No `npm audit` gate or advisory pipeline exists in the repository; run one outside it before a production install. |

## G. Glossary

| Term | Meaning here |
|---|---|
| **Single-statement form** | The whole application is one CommonJS statement on one line ending in one semicolon; no `const app = express()` binding, no route table, no export, no second statement. |
| **Preserved route** | `GET /`, which must keep returning `200` and the 14-byte body `Hello, World!\n`, produced by the unchanged `res.end` handler expression so that `Content-Type` stays absent. |
| **Framework default** | Behaviour the application does not implement and must not add: the `404` for unmatched paths, `OPTIONS`/`HEAD` handling, the `ETag` and `Content-Length` the response machinery adds, and the `X-Powered-By: Express` header. |
| **Readiness line** | The single 41-byte stdout line `Server running at http://127.0.0.1:3000/`. It is emitted once, only after the port is bound, and never on a failed start. |
| **Failed bind** | Starting when port 3000 is already held. Produces exit 1, nothing on stdout and `EADDRINUSE` on stderr. |
| **The gate** | The verification substitute for a test suite: `node --check server.js`, one boot, the route requests, the 404 check and the two failure runs. |
| **Sanctioned departure** | A departure from a written rule that a higher authority required — here, the mandated boot-and-curl gate overriding the ban on measured requests and repository sweeps. |
| **Accepted caveat** | Something the agreed scope deliberately excludes from the code (a lockfile, an environment-configured port, a health endpoint, header hardening) and that a deployment must therefore handle outside the application. |
