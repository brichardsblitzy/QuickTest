# 1. Executive Summary

## 1.1 Project Overview

This project is a two-route HTTP service. Its objective was to add a second response, `GET /good-evening`, served by Express, while `GET /` kept the response it already returned, byte for byte. Its consumers are the callers of the endpoint and the operator who runs it. The change is deliberately minimal and is the whole scope: one line of the single application module, plus the manifest the new dependency forces into existence — no new module, test suite, documentation, configuration, hardening or port change. Nothing is persisted, nothing is authenticated, and no request is logged.

## 1.2 Completion Status

**86% complete — 37 of 43 hours**, measured only against the work the project was scoped for: the delivered requirements and the path-to-production activities that put them live.

```mermaid
%%{init: {"themeVariables": {"pie1": "#5B39F3", "pie2": "#FFFFFF", "pieStrokeColor": "#B23AF2", "pieOuterStrokeColor": "#B23AF2", "pieTitleTextColor": "#B23AF2", "pieSectionTextColor": "#FFFFFF", "pieLegendTextColor": "#B23AF2"}}}%%
pie title Completion Status — 86% (37h of 43h)
    "Completed Work" : 37
    "Remaining Work" : 6
```

| Measure | Hours |
|---|---|
| Total Hours | 43 |
| Completed Hours (AI + Manual) | 37 |
| Remaining Hours | 6 |
| Completion | 86% (37 ÷ 43) |

## 1.3 Key Accomplishments

- `GET /good-evening` returns 200, `Content-Type: text/plain` (no charset), a 13-byte body, `Content-Length: 13`, no ETag, no `X-Powered-By` (`server.js:1`).
- `GET /` is byte-for-byte its previous response: 200, `Content-Length: 14`, no `Content-Type`, no header added (`server.js:1`).
- The catch-all handler is replaced by routing; everything else is answered by the framework, with no application body (`server.js:1`).
- The dependency is declared in a manifest holding only a name, a version and that dependency (`package.json`).
- Startup is untouched: one listener on the literal port 3000, one startup line per run.
- 61 assertions against the running service — contracts, dispatch, lifecycle, hostile input, concurrency, observability — all passed.

## 1.4 Critical Unresolved Issues

**0 of the 4 items the request named** remain open; **3 of 3** path-to-production items do:

| Issue | Impact | Owner | ETA |
|---|---|---|---|
| Acceptance walkthrough in the environment where the service will run: install the declared range, start it, byte-verify both contracts, confirm a clean stop | Only the version resolved here (5.3.0) has been exercised; another 5.x minor the operator's install resolves is unverified, and the contracts are unsigned off there | Service owner / operations | 2h after scheduling |
| Dependency resolution is unpinned and no lockfile pins the transitive tree | Every install picks the latest 5.x, so the checked dependency tree and the installed one can drift apart | Service owner | 2h |
| Path-matching and HEAD semantics are framework defaults nobody has accepted for these consumers (trailing slash, case-insensitive and absolute-form targets all reach the same handler; HEAD carries no `Content-Length`) | A cache or reverse proxy placed in front would treat URLs this server answers identically as distinct resources | Service owner | 2h |

## 1.5 Access Issues

No access issues identified: the project consumes no credential, key or third-party service and needs no privileged access. Its fixed port is an operational matter, assessed in Section 6.

## 1.6 Recommended Next Steps

1. **[High]** Acceptance walkthrough in the target environment: install the declared dependency range, start the service, byte-verify both contracts, confirm a clean stop (2h).
2. **[Medium]** Decide dependency reproducibility — pin or lock the `express` range, then re-check advisories on the resolved tree (2h).
3. **[Medium]** Put TLS, transport security headers, request logging and rate limits in front of the service at a proxy, and set the production environment.
4. **[Low]** Decide whether the framework-default path matching and HEAD behaviour suit these consumers, and normalise in the proxy if they do not (2h).

# 2. Project Hours Breakdown

## 2.1 Completed Work Detail

| Component | Hours | Description |
|---|---|---|
| New route contract — `GET /good-evening` | 6 | The application created inline in place of the single inline request handler, the new route registered on it first, and the exact response written with the runtime's own header setter and response end: 200, `text/plain` with no charset parameter, a 13-byte `Good evening` body, `Content-Length: 13`, no ETag. (`server.js:1`) |
| Preserved response — `GET /` | 4 | The pre-existing route re-registered on the application and answered with the unchanged `res.end('Hello, World!\n')`, with the framework's default `X-Powered-By` header switched off so the response keeps its original header set byte for byte. (`server.js:1`) |
| Dependency manifest | 2 | `package.json` created holding only a name, a version and the single `express` dependency at the assumed major, with no other field and no lockfile. (`package.json`) |
| Routing and framework defaults | 4 | Route dispatch replacing the former catch-all, method and query-string behaviour, and the framework's own handling of every request the two routes do not answer — verified so that no unmatched path or method reaches an application body. (`server.js:1`) |
| Startup-path continuity and observability | 3 | The unchanged construction, bind and startup callback: one listener on the literal port 3000, one byte-exact startup line printed once per run, and no per-request output. (`server.js:1`) |
| Runtime verification of the served contract | 10 | Both contracts exercised over the running service: status and header bytes, exact body bytes and digests, query and content-negotiation variance, conditional and range requests, dispatch and default handling, malformed and oversized input, pipelining, parallel load, restart and clean stop. |
| Static verification of the change | 5 | The line measured and character-compared against its specification, the manifest's field set and range validated, and every constraint and demanded absence walked across the tree. |
| Security and disclosure review | 3 | The served surface assessed for credential handling, injected headers and body reflection, the disclosure posture of every response, and the resolved dependency tree checked against the public advisory database. |
| **Total** | **37** | Sum of the completed work above; identical to Completed Hours in Section 1.2. |

## 2.2 Remaining Work Detail

| Category | Hours | Priority |
|---|---|---|
| Acceptance walkthrough in the target environment — install the declared range, start the service, byte-verify both route contracts, confirm a clean stop | 2 | High |
| Dependency reproducibility — decide whether to pin or lock the `express` range and re-check advisories against the resolved tree | 2 | Medium |
| Path-matching and HEAD semantics — decide whether the framework defaults are acceptable for these consumers, or normalise them in front of the service | 2 | Low |
| **Total** | **6** | |

All six remaining hours are path-to-production work; no scoped requirement is outstanding, and none of the absences the project requires — no hardening, no authentication, no transport security, no observability layer, no lockfile — is costed here, because each is a deliberate part of what was agreed rather than unfinished work.

**Hours calculation.** 37 hours completed + 6 hours remaining = **43 total project hours**, so completion is **37 ÷ 43 = 86%**. These are the figures carried by Section 1.2, Section 7 and Section 8.

# 3. Test Results

The project ships no test framework, no test file and no test runner, and none was to be added, so the delivered contract was exercised directly against the running service: a Node 22.23.4 runtime, `curl`, and raw sockets over TCP, with the listener proved to belong to the process under test before any response was recorded. The counts below are the assertions actually executed and their observed outcomes; the repository contains no coverage tooling, so coverage cannot be measured for any area.

| Area / Category | Framework | Tests | Passed | Failed | Coverage | What This Proves |
|---|---|---|---|---|---|---|
| New route contract — `GET /good-evening` | Node 22.23.4, `curl` header/body capture, `cmp`, sha256 | 14 | 14 | 0 | Not measurable — no coverage tooling ships with the project | The route serves exactly the agreed response: 200, `Content-Type: text/plain` with no charset parameter, a 13-byte `Good evening` + LF body, `Content-Length: 13`, and neither an ETag nor an `X-Powered-By` header, unchanged under query strings, content negotiation and conditional headers |
| Preserved response — `GET /` | Node 22.23.4, `curl`, `cmp`, sha256, header-name census | 11 | 11 | 0 | Not measurable — no coverage tooling ships with the project | The response that existed before the change is untouched: same status, byte-identical 14-byte body, no `Content-Type` line at all, no header added, and unchanged header set under query, range and conditional requests |
| Routing and framework default handling | Node 22.23.4, `curl`, raw sockets | 11 | 11 | 0 | Not measurable — no coverage tooling ships with the project | Each path reaches its own handler and nothing else does: unmatched paths, prefix paths, traversal paths, null-byte paths, non-GET methods and unknown method tokens are answered by the framework, never by an application body, and `OPTIONS` and `HEAD` behave as the framework defines |
| Build gate, dependency resolution and lifecycle | `npm`, `node --check`, a Node port probe, socket-inode ownership check | 10 | 10 | 0 | Not measurable — no coverage tooling ships with the project | The module compiles, the declared dependency resolves at a version satisfying the range, exactly one listener binds the literal port, the startup line is byte-exact and printed once, and start, stop and restart are clean with the port released |
| Input robustness and concurrency | Node 22.23.4, `curl`, raw sockets, parallel load | 11 | 11 | 0 | Not measurable — no coverage tooling ships with the project | Hostile and oversized input never changes a response body and never crashes the process: injected CRLF never becomes a header, a script payload in the path is never reflected raw, 40 KB of headers is refused by the parser, two pipelined requests are both answered, and 50 parallel requests per route return exactly 13 and 14 bytes respectively |
| Observability surface | `wc`, `cmp`, log capture | 4 | 4 | 0 | Not measurable — no coverage tooling ships with the project | The process log holds one byte-exact startup line and nothing else — no per-request output, no warning, no error — before, during and after the whole load and hostile-input run |
| **Total** | | **61** | **61** | **0** | | |

### Not Covered

- **No test suite exists in the repository.** The project ships no test file, no runner and no build gate beyond the syntax check `node --check server.js`, so nothing above re-runs by itself; the assertions were executed against the running service and their outcomes are stated here rather than encoded as an automated gate.
- **Dependency versions other than the one resolved here.** Only `express` 5.3.0 was exercised. The declared range admits any later 5.x minor, and no test, gate or lockfile in the project constrains or re-verifies what a different install resolves.
- **The framework's internal error path.** Neither handler can throw and no registered path takes a parameter, so the framework's development-environment error response is unreachable from the delivered code and was never produced by any test; it becomes reachable only if a handler that can fail, or a parameterised route, is added later.
- **Anything beyond plain HTTP/1.x.** HTTP/2, TLS and any other transport are not served by this project and were not exercised, and neither application route carries security headers or cache directives, so no test covers behaviour under a transport-security layer.
- **Dependency and coverage scanning inside the project.** No in-repository dependency or coverage scanner exists; the advisory position for the resolved dependency tree was established by an external database query against that one resolution, not by a repeatable gate.

# 4. Runtime Validation & UI Verification

Every line below was driven against the running service, on the literal port 3000, with the listener proved to belong to the process under test before any response was recorded.

- ✅ **Start-up and bind** — `node server.js` prints exactly `Server running at http://127.0.0.1:3000/` and nothing else, once per run; a single listener binds the literal port 3000 and answers both on the loopback address and on the host's own address.
- ✅ **`GET /good-evening`** — 200, `Content-Type: text/plain` with no charset parameter, `Content-Length: 13`, body exactly `Good evening` plus one LF (sha256 `15827d63…f05c`), no ETag, no `X-Powered-By`; identical under query strings, four content-negotiation values, compression offers and conditional headers.
- ✅ **`GET /`** — 200, `Content-Length: 14`, a byte-exact `Hello, World!` plus LF body (sha256 `c98c24b6…ad31`), no `Content-Type` line at all and no header added; the body and header set are identical to the response the pre-change build returned.
- ✅ **Routing of everything else** — unmatched paths, prefix paths, traversal paths, null-byte paths and encoded variants all return the framework's own response with no application body, and a script payload in the path comes back percent-encoded with no raw markup.
- ✅ **Method handling** — `POST`, `PUT`, `DELETE`, `PATCH` and `TRACE` reach no route handler; `OPTIONS` returns 200 with `Allow: GET, HEAD`; `HEAD` is served by the GET handler with the body suppressed; an unknown method token is refused by the parser with 400.
- ✅ **Load and concurrency** — 50 parallel requests per route each returned exactly 200 with 13 and 14 bytes, two pipelined requests on one connection were both answered correctly, and an HTTP/1.0 client received the preserved body.
- ✅ **Configuration invariance** — the service boots and serves byte-identically with an empty environment (`env -i`, no variables at all) and with `PORT=4000` set, in which case it still binds 3000 and nothing listens on 4000; no configuration file, flag or override exists to change either response.
- ✅ **Restart and clean stop** — stopping the process released the port, and a fresh start rebound the same literal port, printed the startup line once and served both routes byte-exactly again; the log held one line throughout, with no error output at any point.
- ⚠ **Transport and hardening (partial, by design)** — the service is plain HTTP with no TLS, no HSTS and no security headers on either application response, and no per-request logging, metric or health endpoint exists. This is the agreed posture rather than a failure, but nothing was driven through a transport-security layer and no operational visibility beyond the startup line exists.
- ❌ **User interface (not applicable)** — there is no screen, component, style or asset: the service returns HTTP responses only, so no browser flow was driven and no browser check applies.

**Never exercised at runtime.** Only the dependency version resolved here (5.3.0) was ever loaded, so the range's other 5.x releases are untested against these contracts; HTTP/2 and TLS are not served, so no such connection was made; the framework's development-environment error response was never produced because neither handler can fail and no route takes a parameter; and a second concurrent instance on the same host was never run successfully, because the port it must bind is fixed and already held by the first.

# 5. Compliance & Quality Review

## 5.1 Compliance Matrix

| # | Deliverable | Status | Progress | Verified Evidence |
|---|---|---|---|---|
| 1 | `GET /good-evening` serves the agreed contract | ✅ Pass | 100% | `server.js:1`; 14 assertions passed — status, header bytes, 13-byte body, no ETag, no `X-Powered-By` |
| 2 | `GET /` response preserved byte for byte | ✅ Pass | 100% | `server.js:1`; 11 assertions passed — byte-identical body, no `Content-Type`, no added header, identical header set to the pre-change build |
| 3 | Dependency declared and resolvable | ✅ Pass | 100% | `package.json` — three keys only; install resolves `express` 5.3.0, which satisfies the declared `^5.0.0` range |
| 4 | Routing replaces the single catch-all | ✅ Pass | 100% | `server.js:1`; 11 assertions passed — each path answers itself, everything else falls to the framework with no application body |
| 5 | Startup path reused: one listener, literal port, byte-exact startup line | ✅ Pass | 100% | `server.js:1`; listener ownership proved by socket inode, startup line verified with `cmp`, clean stop and restart verified |
| 6 | Observability discipline: one startup line, nothing per request | ✅ Pass | 100% | log verified as exactly one line before, during and after the load and hostile-input run |
| 7 | Scope discipline: two changed files, every required absence present | ✅ Pass | 100% | branch diff is the manifest and the module only; no test, documentation, configuration, lockfile or extra source file exists |
| 8 | Code shape: single statement, single line, compact form, no added comment or whitespace | ✅ Pass | 100% | line measured at 292 characters / 293 bytes, head and tail byte-identical to the previous revision |
| 9 | Repository hygiene: no lockfile, no committed dependency install, no stray artefact | ✅ Pass | 100% | install run without a lockfile; the installed tree is untracked and was never staged; tracked set is two files |
| 10 | Security posture of the served surface | ✅ Pass | 100% | no credential read, no injected header, no reflected markup, no stack trace or absolute path in any response; no `X-Powered-By`, cookie or CORS header anywhere |
| 11 | Dependency advisory posture | ⚠ Partial | 100% of the resolved tree, unpinned | every package the manifest resolves to was checked and none is affected; the check is valid only for that resolution, since no lockfile pins it |
| 12 | Operator readiness in production | ⚠ Partial | Runs as specified; controls deferred | the service serves its contract exactly as agreed, but TLS, security headers, rate and timeout limits, request logging, authentication and dependency pinning are all outside it and remain the operator's to add in front of it |

## 5.2 AAP & Rule Divergences and Gaps

One departure from what was agreed was identified, and it is sanctioned by a higher source; everything else in the delivery matches the specification.

| What the AAP / Rule Required | What Was Delivered Instead | Why It Diverged | Impact | Remediation |
|---|---|---|---|---|
| The change installs nothing and produces no lockfile; the deliverable is the manifest plus the source, with the dependency resolving at the operator's own install | The delivered artefact is exactly manifest plus source and no lockfile exists anywhere in the tree — but an install was run in the working checkout before the service could be started (the installed tree is present, untracked, 65 packages, `express` 5.3.0) | **Sanctioned.** The project's environment instructions require the dependency install as the first step in every working checkout, and they are a higher source than the scope decision they differ from | None on the deliverable: no lockfile was created, nothing from the install was committed, and the changed file set remains the two agreed files. The repository still does not serve until an operator installs | None required. The same install is what the operator performs where the service will run, which is the acceptance walkthrough carried in Section 2.2 |

The departure exists because the service cannot boot without a resolved dependency, and the environment in which it was built and verified requires that resolution to be performed per checkout rather than committed. Nothing about it reaches the repository: the tree still holds exactly the application module and the manifest, no lockfile exists, and the installed dependency is never staged. A reader opening the branch sees the agreed deliverable and nothing more; a reader running it must install once, exactly as the operator will at their own site. No other divergence from the specification, and no departure from a user rule — none exist for this project — was identified. That conclusion rests on a value-by-value and element-by-element comparison of both files against every section of the specification: the delivered line is character-identical to the specified one, the manifest is value-identical to the specified field set, all 24 scoped requirements are met, and every absence the scope requires (test suite, lockfile, committed dependency install, documentation, configuration, logging machinery, hardening, port change, any further dependency, version research) is present as an absence and nothing else. The framework behaviours this delivery adopts — matching that tolerates a trailing slash, case-insensitive paths and absolute-form targets, `HEAD` responses without `Content-Length`, the framework's own response for unmatched requests, the hardcoded host-shared port and the unpinned dependency range — are behaviours the specification permits or requires, so none of them is a divergence; they are carried as residual risk in Section 6.

# 6. Risk Assessment

These are forward-looking: what could still go wrong once the service is in use. Nothing here is a defect in the delivered work, and each item carries the mitigation an operator applies outside the service.

| Risk | Category | Severity | Probability | Mitigation | Status |
|---|---|---|---|---|---|
| The declared dependency range admits later 5.x releases and no lockfile pins the transitive tree, so an install elsewhere can resolve a version whose path matching or default headers differ from the exercised one | Technical | Medium | Medium | Pin or lock the range, then re-run the dependency advisory check against the resolved tree (Section 2.2) | Open |
| The framework-matching tolerances (trailing slash, case-insensitive, absolute-form targets all reaching the same handler) diverge from how a cache or reverse proxy in front treats those URLs, so one resource can be cached or routed under several keys | Integration | Medium | Medium | Decide and record the accepted matching semantics, and normalise the URL in the proxy if the defaults are not acceptable | Open |
| The listener binds the literal port 3000 on the unspecified address, and a port already in use exits the process with an unhandled `EADDRINUSE` rather than a diagnostic, so a second copy cannot coexist on one host and a restart can fail | Operational | Medium | High | Schedule or map the port externally; treat port availability as a deployment precondition and restart policy concern | Accepted |
| No observability beyond a single startup line — no per-request log, metric, health endpoint or trace — so an incident leaves no runtime evidence to investigate | Operational | Medium | High | Add request logging, a health endpoint and metrics in the operational layer in front of or beside the service | Accepted |
| Plain HTTP with no TLS, no HSTS and no security headers on either application response, so traffic can be read or modified in transit and browsers get no transport protections | Security | Medium | Low | Terminate TLS and add the transport security headers at a proxy; do not carry sensitive data on this endpoint until then | Accepted |
| The service authenticates nobody and reads no credential, so any caller from any address reaches both routes | Security | Low | High | Treat the endpoint as public and non-sensitive, restrict it at the network layer, and add authentication if the consumers ever require it | Accepted |
| No rate limiting and no request timeout beyond the runtime defaults, so a slow or abusive client can hold connections for the default windows | Operational | Low | Medium | Enforce rate, connection and timeout limits at the proxy | Accepted |
| The framework runs in its development environment by default, so a handler able to fail — or a parameterised route — added later would return a response body carrying a stack trace | Security | Low | Low | Set the production environment wherever the service is deployed, so the framework suppresses internal detail even before an error handler exists | Open |

Two of these are open decisions or deployment steps a human closes and are costed in Section 2.2; the rest are accepted consequences of the agreed scope, with the control that addresses each noted for the operator.

# 7. Visual Project Status

**Project hours.** 37 hours of completed work against 6 hours remaining — **86% complete**.

```mermaid
%%{init: {"themeVariables": {"pie1": "#5B39F3", "pie2": "#FFFFFF", "pieStrokeColor": "#B23AF2", "pieOuterStrokeColor": "#B23AF2", "pieTitleTextColor": "#B23AF2", "pieSectionTextColor": "#FFFFFF", "pieLegendTextColor": "#B23AF2"}}}%%
pie title Project Hours Breakdown
    "Completed Work" : 37
    "Remaining Work" : 6
```

| Remaining work by priority | Hours |
|---|---|
| High — acceptance walkthrough in the target environment | 2 |
| Medium — dependency reproducibility decision | 2 |
| Low — path-matching and HEAD semantics decision | 2 |
| **Total remaining** | **6** |

# 8. Summary & Recommendations

**What was delivered and verified.** The service now answers two paths instead of one. `GET /good-evening` returns 200 with `Content-Type: text/plain` exactly, a 13-byte `Good evening` plus LF body, `Content-Length: 13` and neither an ETag nor an `X-Powered-By` header; `GET /` returns the response it returned before the change, byte for byte, with no `Content-Type` line and no header added. Both are served from the listener the service already created, on the unchanged literal port 3000, with the same startup line printed exactly once. 61 assertions were executed against the running service across the two contracts, routing and framework default handling, the build gate and lifecycle, hostile input and concurrency, and the observability surface, and every one passed (`server.js:1`, `package.json`).

**What is not finished.** Nothing the request asked for is outstanding. **86%** of the scoped work is complete (37 of 43 hours); the 6 remaining hours are path-to-production: an acceptance walkthrough in the environment where the service will run, a decision on whether to pin or lock the dependency range, and a decision on whether the framework's own path-matching and HEAD behaviour is acceptable for these consumers. Sections 3 and 4 record what no test covers — every dependency version other than the one resolved here, the framework's unreachable error path, and any transport beyond plain HTTP.

**Critical path to production.** Three steps, in order. First, install the dependency range and run the service where it will live, verifying both contracts there and confirming a clean stop. Second, decide dependency reproducibility; if the range is to be pinned, re-run the dependency advisory check against the tree that results. Third, place the service behind the controls it does not carry — TLS, transport security headers, request logging, health and metrics, rate and timeout limits — and set the production environment so that a handler able to fail later cannot return internal detail. Only the first two are costed work; the third is an operational decision that the agreed scope deliberately leaves outside the service.

**Production readiness.** The service is ready to serve exactly the contract it was built for, and it runs under an empty environment with no configuration, credential or external system. It is not production-hardened, and that is by design rather than by omission: the absence of TLS, security headers, authentication, rate limits, request logging and dependency pinning is what was agreed, and each is recorded in Section 6 with the control that addresses it. Readiness for a public production endpoint therefore depends on the operational layer described above, not on any further change to these two files.

| Metric | Value |
|---|---|
| Completion | 86% (37 of 43 hours) |
| Completed work | 37 hours across eight delivered components |
| Remaining work | 6 hours, all path-to-production |
| Scoped requirements delivered | 24 of 24 |
| Assertions executed against the running service | 61 executed, 61 passed, 0 failed |
| Files changed | 2 — `server.js` (1 line replaced), `package.json` (created) |
| Open items | 0 of the 4 items the request named; 3 of 3 path-to-production items |
| Divergences | 1, sanctioned by the project's own environment instructions |

# 9. Development Guide

## System Prerequisites

- A Node.js runtime able to run a CommonJS script. The dependency declares support for Node 18 and above; **Node v22.23.4** was the version used to exercise every command below.
- `npm` for the one dependency install (npm 11.21.0 here).
- `curl` for the checks below. Nothing else is needed: no database, cache, queue, container, credential or environment variable — the service starts with an empty environment and reads no configuration.

```bash
node --version    # v22.23.4
npm --version     # 11.21.0
```

## Environment Setup

No environment setup is required or supported. The service reads no environment variable, needs no secret, and binds the port 3000 literal in `server.js`; setting a port variable has no effect. Work from the repository root, where `server.js` and `package.json` live.

## Dependency Installation

Run this once per checkout, from the repository root:

```bash
npm install --no-package-lock --no-audit --no-fund
```

- `express` 5.3.0 and its transitive packages install into `node_modules/` (65 packages in a clean install).
- `--no-package-lock` matters: the project does not commit a lockfile, and without the flag npm writes one.
- The installed tree is a local prerequisite and is never committed.

Confirm the install resolved inside the declared range, and that the module compiles:

```bash
node -p "require('express/package.json').version"   # 5.3.0  (declared: ^5.0.0)
node --check server.js                              # no output, exit 0
```

## Application Startup

`node server.js` never returns, so start it in the background and note the process id. The port cannot be changed in the source, so check first that it is free — if `lsof` or `ss` is missing, use a runtime probe:

```bash
node -e "const n=require('net');const s=n.createServer();s.on('error',()=>{console.log('port 3000 busy');process.exit(0)});s.listen(3000,()=>{console.log('port 3000 free');s.close()})"

node server.js > server.log 2>&1 &
pid=$!
for i in $(seq 1 40); do curl -sf -o /dev/null http://127.0.0.1:3000/ && break; sleep 0.25; done
cat server.log        # Server running at http://127.0.0.1:3000/
```

The service prints that one line at startup and nothing else for the whole run. Stop it with the id you started:

```bash
kill "$pid"
```

## Verification Steps

Check the new route's contract and headers:

```bash
curl -sS -i http://127.0.0.1:3000/good-evening
# HTTP/1.1 200 OK
# Content-Type: text/plain
# Content-Length: 13
#
# Good evening
```

Check the preserved route, which must carry no `Content-Type` at all:

```bash
curl -sS -i http://127.0.0.1:3000/
# HTTP/1.1 200 OK
# Content-Length: 14
#
# Hello, World!
```

Verify the response bytes exactly, and that the content type has no charset parameter (curl terminates header lines with a carriage return, so strip it before matching the end of the line):

```bash
curl -s http://127.0.0.1:3000/good-evening | cmp - <(printf 'Good evening\n') && echo 'PASS /good-evening'
curl -s http://127.0.0.1:3000/           | cmp - <(printf 'Hello, World!\n') && echo 'PASS /'
curl -sI http://127.0.0.1:3000/good-evening | tr -d '\r' | grep -qi '^content-type: text/plain$' && echo 'PASS content-type'
curl -sI http://127.0.0.1:3000/            | grep -qi 'content-type\|x-powered-by' && echo 'FAIL header cleanliness' || echo 'PASS header cleanliness'
```

Anything the two routes do not answer — any other path, or a non-GET method on either path — is answered by the framework, not by the application:

```bash
curl -sS -o /dev/null -w 'status=%{http_code}\n' http://127.0.0.1:3000/no-such-path   # status=404
curl -sS -o /dev/null -w 'status=%{http_code}\n' -X POST http://127.0.0.1:3000/       # status=404
curl -sS -o /dev/null -w 'status=%{http_code}\n' -X OPTIONS http://127.0.0.1:3000/    # status=200, Allow: GET, HEAD
```

## Example Usage

```bash
# start
node server.js > server.log 2>&1 & pid=$!
for i in $(seq 1 40); do curl -sf -o /dev/null http://127.0.0.1:3000/ && break; sleep 0.25; done

# the new route
curl -sS -o /dev/null -w 'new route: %{http_code} %{size_download} bytes, type=%{content_type}\n' http://127.0.0.1:3000/good-evening
# new route: 200 13 bytes, type=text/plain

# the preserved route
curl -sS -o /dev/null -w 'preserved: %{http_code} %{size_download} bytes, type=[%{content_type}]\n' http://127.0.0.1:3000/
# preserved: 200 14 bytes, type=[]

# a request neither route answers
curl -sS -o /dev/null -w 'unmatched: %{http_code}\n' http://127.0.0.1:3000/anything-else
# unmatched: 404

# stop, and confirm the port is released
kill "$pid"
node -e "const n=require('net');const s=n.createServer();s.on('error',()=>{console.log('port 3000 busy');process.exit(0)});s.listen(3000,()=>{console.log('port 3000 released');s.close()})"
```

## Troubleshooting

- **`Error: Cannot find module 'express'` (exit 1, with a `Require stack:` trace)** — the dependency is not installed in this checkout. Run `npm install --no-package-lock --no-audit --no-fund` from the repository root, in the same directory that holds `package.json`.
- **`Error: listen EADDRINUSE: address already in use :::3000` (exit 1)** — something already holds the port, which is a fixed literal in `server.js` and cannot be changed there. Find and stop the process that owns it, or run this instance behind a mapping that presents it on another port.
- **`curl: (7) Failed to connect`** — nothing is listening yet, or the service exited. Check the startup line in the log and re-run the port probe above to see whether the port is free.
- **The content-type check prints nothing** — curl terminates header lines with a carriage return, so a pattern anchored to the end of the line never matches until the carriage return is stripped (`tr -d '\r'`, as in the verification block above). The header itself is correct; the assertion is what needs normalising.
- **Unexpected log output** — the service writes exactly one line per run. Any other output means an environment variable such as `DEBUG` has switched on the framework's internal diagnostics on stderr; it does not change either response.

# 10. Appendices

## Appendix A. Command Reference

| Purpose | Command |
|---|---|
| Install the dependency (once per checkout) | `npm install --no-package-lock --no-audit --no-fund` |
| Compile gate | `node --check server.js` |
| Check the resolved dependency version | `node -p "require('express/package.json').version"` |
| Check whether the port is free | `node -e "const n=require('net');const s=n.createServer();s.on('error',()=>{console.log('busy');process.exit(0)});s.listen(3000,()=>{console.log('free');s.close()})"` |
| Start the service | `node server.js > server.log 2>&1 & pid=$!` |
| Stop the service | `kill "$pid"` |
| Fetch the new route with headers | `curl -sS -i http://127.0.0.1:3000/good-evening` |
| Fetch the preserved route with headers | `curl -sS -i http://127.0.0.1:3000/` |
| Byte-compare a response body | `curl -s http://127.0.0.1:3000/good-evening \| cmp - <(printf 'Good evening\n')` |
| Confirm the content type has no charset | `curl -sI http://127.0.0.1:3000/good-evening \| tr -d '\r' \| grep -qi '^content-type: text/plain$'` |
| Confirm the preserved response carries no added header | `curl -sI http://127.0.0.1:3000/ \| grep -qi 'content-type\|x-powered-by' && echo FAIL \|\| echo PASS` |
| Status of an unmatched path | `curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/no-such-path` |

## Appendix B. Port Reference

| Port | Protocol | Bound by | Notes |
|---|---|---|---|
| 3000 | HTTP | `server.js:1` — `.listen(3000, …)`, no host argument, so the unspecified address | The only port the service binds. It is a literal in the source and cannot be changed there; the startup line always prints `http://127.0.0.1:3000/` even though the socket also answers on the host's own address. A port already in use makes the process exit with an unhandled `EADDRINUSE` |

No other port is bound, and no outbound connection is ever made.

## Appendix C. Key File Locations

| Path | Role |
|---|---|
| `server.js` | The whole application: one statement on line 1 — the runtime's server construction, the Express application created inline, the framework's default header switched off, the `GET /good-evening` route, the `GET /` route, and the startup callback |
| `package.json` | The manifest: name, version and the single `express` dependency — no other field, no `scripts`, no lockfile |
| `node_modules/` | The dependency install. Local to each checkout, untracked, never committed |

There is no other source, configuration, test, documentation or asset file in the repository.

## Appendix D. Technology Versions

| Component | Version | Notes |
|---|---|---|
| Node.js | 22.23.4 | The dependency declares support from Node 18 upward |
| npm | 11.21.0 | Used for the single install |
| express | 5.3.0 resolved for the declared `^5.0.0` | The only dependency; supplies routing, and its default `X-Powered-By` header is switched off |
| Module format | CommonJS | No `type` field in the manifest; the entry point uses `require` |

## Appendix E. Environment Variable Reference

| Variable | Read by the service | Effect |
|---|---|---|
| Any variable, including `PORT` and `NODE_ENV` | No | None. The service starts and serves identically under an empty environment; the port is a source literal, and no configuration file, flag or override layer exists |

No secret, key or variable is required, and none is consumed. The one variable worth knowing about operationally is the framework's own environment setting, which defaults to development: setting it to production where the service is deployed keeps internal detail out of any error response a later code change might produce.

## Appendix F. Developer Tools Guide

| Tool | Availability | Use |
|---|---|---|
| `node`, `npm` | Required | Install, compile gate, port probe, running the service |
| `curl` | Required for the checks above | All request and header checks in Appendix A |
| `cmp`, `od`, `sha256sum`, `wc` | Standard | Byte-exact body verification and digest comparison |
| `git` | Standard | Inspecting the change: `git log`, `git diff` |
| `lsof`, `ss`, `nc`, `xxd` | Optional, often absent | The Node port probe in Appendix A stands in for `lsof` and `ss`, and `od -c` stands in for `xxd` |
| A browser | Not needed | The service has no user interface, so no browser step exists in this project |

## Appendix G. Glossary

| Term | Meaning in this project |
|---|---|
| Express application | The object returned by `require('express')()` and passed as the request handler of the runtime's server. It is what tells the two paths apart |
| Preserved response | The response `GET /` returned before the change: 200, `Content-Length: 14`, no `Content-Type`, body `Hello, World!` plus one LF. It must remain byte-identical |
| Framework default handling | What the framework does with a request neither route answers — its own 404 page, its own `Allow` header for `OPTIONS`, and its own error response |
| `x-powered-by` | The framework's default header that advertises it. It is switched off so that the preserved response keeps its original header set |
| Contract assertion | A single recorded check of one observable property of a response — status line, a header's exact value, a body's exact bytes, or the absence of a header |
| Path-to-production work | Acceptance and decision work needed to put the delivered pair live, as distinct from the delivered requirements themselves |
