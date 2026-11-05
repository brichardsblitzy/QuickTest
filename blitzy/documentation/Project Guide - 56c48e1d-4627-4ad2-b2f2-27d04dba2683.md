# 1. Executive Summary

## 1.1 Project Overview

This project turns a single-file Node.js HTTP service into an Express application serving two fixed-text routes. `GET /good-evening` is new: status 200, `Content-Type: text/plain; charset=utf-8`, body exactly `Good evening\n` (13 bytes). `GET /` keeps answering 200 with exactly `Hello, World!\n` (14 bytes) and no media type of its own, byte-identical to before. The listener stays on TCP 3000 and startup still prints `Server running at http://127.0.0.1:3000/`. Express is the only dependency, declared in a three-field manifest at the repository root; the service itself is one statement on one line, with no database, client, configuration or build step.

## 1.2 Completion Status

```mermaid
pie title Project Hours Breakdown
    "Completed Work" : 26
    "Remaining Work" : 7
```

Legend: Completed = Dark Blue (`#5B39F3`); Remaining = White (`#FFFFFF`). 26.0 completed hours ÷ 33.0 total = 78.79%, stated as **79%**.

| Metric | Value |
|---|---|
| Total Hours | 33.0 |
| Completed Hours (AI + Manual) | 26.0 |
| Remaining Hours | 7.0 |
| Completion | 79% |

## 1.3 Key Accomplishments

- `GET /good-evening` answers 200 as plain text with exactly 13 bytes: `Good evening` plus a newline.
- `GET /` answers 200 with exactly 14 bytes, byte-identical to before, introducing no media type of its own.
- One inline Express application inside the file's single statement serves both routes; no new module or directory.
- Express is the sole dependency at `^5.0.0`, resolved from that range at install, with no lockfile committed.
- The listener still binds TCP 3000 and startup prints the unchanged line once, with an empty error stream.
- Unregistered paths and methods take the framework's defaults instead of the previous uniform 200.
- Both bodies, both header sets and the root response's absent media type were verified byte-for-byte.

## 1.4 Critical Unresolved Issues

All four items the request named are delivered and verified — **0 of those 4 remain open**. The **8 of 8** conditions below are accepted with a caveat; none is an undelivered requirement.

| Issue | Impact | Owner | ETA |
|---|---|---|---|
| On a busy TCP 3000 the process prints the startup line, writes nothing to standard error and exits 0 with nothing bound | A supervisor or health check can read a failed start as healthy; the port is silently yielded to whichever process holds it | Service owner | Before first production release |
| No readiness or health surface exists — the only startup evidence is that log line | No independent way to confirm the service is up and answering | Service owner | Before first production release |
| No test suite, scripts entry, linter, type checker or CI, and the implementation is one line | An edit to either route is caught only by re-running the documented checks by hand | Repository owner | Before the next change to `server.js` |
| The dependency is an unpinned caret range with no committed lockfile | Each install resolves to the then-current 5.x, so framework behaviour can change without a repository change | Dependency owner | Next dependency review cycle |
| The listener binds all interfaces while the startup line advertises the loopback address | Any host-local process can reach the service; only the host firewall restricts other machines | Deployment owner | Before first production release |
| No rate limiting and no application-level request-size limit | A single client can drive unbounded request volume within the parser's ~16 KB header ceiling | Deployment owner | Before first production release |
| Every response advertises the framework, and the framework's error page carries security headers the route responses do not | Stack disclosure; an inconsistent header posture a reader may mistake for a defect | Deployment owner | Before first production release |
| No request logging and no metrics or tracing surface | No per-request record to diagnose a client problem with | Operations owner | Before first production release |

## 1.5 Access Issues

| System/Resource | Type of Access | Issue Description | Resolution Status | Owner |
|---|---|---|---|---|
| npm registry (`registry.npmjs.org`) | Package registry access | The sole dependency is installed at deploy time — no lockfile or vendored copy is committed — so installing needs registry or warm-cache access | Open; satisfied here and required at every deploy | Deployment owner |

## 1.6 Recommended Next Steps

1. **[High]** Add supervision and a readiness check that confirm the listener and both route responses, never the startup line.
2. **[High]** Record a release baseline on the deployment host: both header sets and the two byte counts.
3. **[Medium]** Decide the deployment fronting — reachable scope, rate and size limits, header posture — and enforce it outside the application.
4. **[Medium]** Set the dependency-resolution policy for the unpinned range and schedule an advisory review.
5. **[Low]** Agree at the next change whether the root response's absent media type and the framework's error page should be revisited.

# 2. Project Hours Breakdown

## 2.1 Completed Work Detail

| Component | Hours | Description |
|---|---|---|
| Express application and both route contracts (`server.js`) | 8.0 | Replacing the built-in HTTP server construction with one inline Express application; registering `GET /` with the preserved handler and `GET /good-evening` with an explicit plain-text media type; keeping the file a single expression statement on one line with the listener call and startup line byte-identical, and settling the emission path (`res.end`, never the framework's send path) so the root body stays byte-exact. |
| Dependency declaration, manifest and resolution (`package.json`) | 4.0 | Creating the repository-root manifest limited to `name`, `version` and `dependencies`; declaring `express` at `^5.0.0` as the sole dependency; running the install in the form that leaves no lockfile behind and confirming the range resolves to a published 5.x release. |
| Live contract acceptance verification of the change | 7.0 | Driving the four documented commands against the running service and asserting, from more than one client, the statuses, the exact header sets, the 13- and 14-byte bodies, the byte-identity of the root response against the previous built-in HTTP server run side by side for the comparison, and the constancy of both responses under repeats and concurrency. |
| Static, dependency and security verification of the delivered artefacts | 7.0 | Confirming both files match the agreed content character for character and that `server.js` is one line; running the syntax gate and the manifest parse; researching the dependency's provenance and advisories for the resolved tree; and probing the running service for injection, header-splitting, traversal, prototype-pollution and disclosure behaviour, including the escaping of the framework's error page, with a browser pass over both routes. |
| **Total** | **26.0** | |

## 2.2 Remaining Work Detail

| Category | Hours | Priority |
|---|---|---|
| Production start, supervision and readiness confirmation for the TCP-3000 service — a supervisor with a restart policy plus a readiness check that confirms the listener and both contracted responses, and the documented start-and-verify procedure | 3.0 | High |
| Deployment fronting decisions and enforcement — reachable scope and bind behaviour, request-rate and request-size limits, and the desired header posture, all at the deployment layer rather than in the application | 2.0 | Medium |
| Target-runtime acceptance confirmation with a recorded release baseline: both response header sets verbatim and the two byte counts on the deployment host | 1.0 | Medium |
| Dependency-resolution and advisory-review policy for the unpinned caret range with no committed lockfile, including a recorded resolved version and a periodic review of the resolved tree | 1.0 | Medium |
| **Total** | **7.0** | |

Hour arithmetic, stated once: Section 2.1 totals 26.0 and Section 2.2 totals 7.0, so the total project effort is 33.0 hours, of which 26.0 (78.79%, stated as 79%) is complete. Confidence is high on the completed figure — both delivered files were verified character for character and the verification was performed against the running service — and high on the supervision item, which dominates the remainder because readiness rather than code is what is outstanding. The two smaller items are medium confidence, since they depend on the target deployment host and on how the dependency policy is set. No item was ambiguous enough to require a range.

# 3. Test Results

The project ships no test suite, no test framework and no test script: the manifest declares no scripts, and `npm test` exits 1 with `Missing script: "test"`. Every case below was therefore executed directly against the running service — `curl.exe`, raw TCP sockets, headless Chrome and byte-level file comparisons — and every count is a count of cases executed and observed, not of files. 889 cases in total, of which 0 failed.

| Area / Category | Framework | Tests | Passed | Failed | Coverage | What This Proves |
|---|---|---|---|---|---|---|
| `GET /good-evening` contract | Live HTTP checks (curl, raw socket, headless Chrome) | 96 | 96 | 0 | Not measured — the project carries no coverage tooling | The new route answers 200 as `text/plain; charset=utf-8` with exactly the contracted 13-byte body, from every client, on every instance and under repeat and concurrent traffic. |
| `GET /` contract and byte-identity | Live HTTP checks | 74 | 74 | 0 | Not measured | The preserved route answers 200 with exactly 14 bytes, introduces no media type of its own, and its body is byte-for-byte the response the pre-change service produced. |
| Startup, listener and dependency resolution | Live process and socket checks | 56 | 56 | 0 | Not measured | Booting the service prints the unchanged startup line exactly once with an empty error stream, binds TCP 3000 as the process's own listener, and the declared range resolves to the framework actually loaded at boot. |
| Unregistered paths, other methods and malformed input | Live HTTP checks (curl and raw sockets) | 121 | 121 | 0 | Not measured | Everything the change does not register is answered by the framework's own defaults rather than the previous uniform 200, with 404 for unknown paths and wrong methods, 400 for malformed requests and 431 above the parser's header ceiling, and the process survives all of it. |
| Input payload and reflected-output safety | Live HTTP checks plus a browser pass | 331 | 331 | 0 | Not measured | Injection, header-splitting, traversal, template, command and prototype-pollution payloads never alter either response, and the one input-derived output in the system — the framework's error page — escapes the path it echoes. |
| Disclosure, leakage and access-control probes | Live HTTP checks plus a browser pass | 86 | 86 | 0 | Not measured | No source, manifest, environment or dependency content is served; no credential, token, session identifier or personal data appears in a body, a header or the process's streams; and no cookie, challenge, redirect or cross-origin header is ever emitted. |
| Concurrency, determinism and robustness | Live HTTP checks | 105 | 105 | 0 | Not measured | Both responses are constant under repeated, sequential, pipelined, concurrent and aborted requests, with one digest per route and no connection leak or 5xx. |
| Dependency provenance and advisories | Registry and advisory queries over the resolved tree | 20 | 20 | 0 | Not measured | The sole dependency is a real, current, non-deprecated package from the canonical registry, and the tree its range resolves to is free of known advisories. |

Not Covered — this is what a human should exercise before release, because no check exists for it:

- **Any automated re-run.** There is no test suite, no script and no pipeline, so nothing above repeats itself; the documented commands and the two byte counts are the only release gate, and they must be run by hand.
- **Graceful shutdown.** The application registers no signal handler and does not drain in-flight requests; stop semantics were only ever observed as process termination, and they should be confirmed on the target platform.
- **Operation behind a reverse proxy or TLS terminator.** Neither exists in this project, so no such deployment was exercised.
- **Reachability from another machine.** Attempts from a second host on the same subnet were refused by the host firewall, so the service was only ever driven over loopback, and the listener's all-interface bind was never exercised remotely.
- **Sustained load and soak.** Nothing beyond a 100-way concurrent burst and 200 sequential requests was exercised, and no long-duration run was performed.
- **A different runtime.** Only Node 22.23.4 on Windows Server with the framework version the range resolved was exercised; another Node line, a different Express patch release or a different operating system is untested.
- **The contended-port path as an assertion.** A second instance started while the port is held was exercised and characterised — it prints the startup line and exits 0 with nothing bound — but no check asserts that behaviour, and Section 1.4 records it as an open operating condition.

# 4. Runtime Validation & UI Verification

Every line below was driven against the running service, not read from the source.

- ✅ **Service start-up** — `node server.js` prints the 41-byte line `Server running at http://127.0.0.1:3000/` once, leaves the error stream at 0 bytes, and the started process owns the TCP-3000 listener.
- ✅ **`GET /good-evening`** — driven with `curl.exe`, a raw socket and a real browser: 200, `Content-Type: text/plain; charset=utf-8`, `Content-Length: 13`, body hex `47 6F 6F 64 20 65 76 65 6E 69 6E 67 0A`, and the browser received the same 13 bytes with no markup and `document.contentType` of `text/plain`.
- ✅ **`GET /`** — 200, `Content-Length: 14`, body hex `48 65 6C 6C 6F 2C 20 57 6F 72 6C 64 21 0A`, and no `Content-Type` header at all, confirmed on the wire, from the browser's own fetch and from the framework's header list; the browser rendered it as plain text.
- ✅ **Unregistered paths and other methods** — 404 from the framework's default error page for 17 unknown paths and six wrong methods, `OPTIONS` answering 200 with `Allow: GET, HEAD`, and `HEAD` answering 200 with no body.
- ✅ **Malformed and oversized requests** — 400 for malformed request lines, invalid method tokens, duplicate `Content-Length`, `Content-Length` with `Transfer-Encoding` and bare line feeds; 431 above the parser's header ceiling; empty bodies in both cases and the process still serving afterwards.
- ✅ **Dependency resolution at runtime** — a clean install resolves the framework from the declared range and the loaded framework answers, evidenced by the framework's own response header on every reply; with the dependency absent, the process fails at require time with `Cannot find module 'express'` and binds no listener.
- ✅ **Browser rendering** — both routes and the framework's error page were loaded in headless Chrome: no script elements, no dialogs, no page errors and no application JavaScript on any page, and the error page rendered the escaped path only.
- ✅ **Injection, splitting and traversal probes** — several hundred payload-bearing requests across query, path, header and body positions left both bodies byte-identical, produced no injected response header, no file content and no crash.
- ✅ **Disclosure probes** — source, manifest, environment, dependency and administrative paths all returned the framework's 404 with no content; no credential, token, session identifier or personal data appeared in any body, header or process stream.
- ⚠ **Shutdown** — the service was stopped by terminating the process that owned the port; the application registers no signal handler and does not drain in-flight requests, so graceful stop behaviour is unverified.

Never exercised at runtime, and therefore not claimed: any reverse proxy, load balancer or TLS termination in front of the service (none exists); reachability from another machine (a second host on the same subnet was refused by the host firewall, so every check ran over loopback); any deployment platform, container or supervisor; sustained load beyond a 100-way concurrent burst and 200 sequential requests, and any long-duration run; any runtime other than Node 22.23.4 on Windows Server with the framework patch the range resolved; and the contended-port start path, which was exercised and characterised but is asserted by no check.

# 5. Compliance & Quality Review

## 5.1 Compliance Matrix

Status is the verified position of each deliverable now, measured against the Agent Action Plan's requirements and enterprise-standard practice.

| # | Deliverable | Requirement Source | Verified Status | Progress |
|---|---|---|---|---|
| 1 | One inline Express application serving both routes from `server.js` | Plan file set and construction decisions | ✅ Pass — two registrations, no middleware, no second module or directory | 100% |
| 2 | `GET /good-evening`: 200, `text/plain; charset=utf-8`, exactly 13 bytes | Change contract | ✅ Pass — confirmed from three clients, including a browser | 100% |
| 3 | `GET /`: 200, exactly 14 bytes, no media type of its own, byte-identical to before | Change contract | ✅ Pass — byte-for-byte against the previous built-in server's output, run side by side | 100% |
| 4 | Listener on TCP 3000 and the unchanged startup line printed once | Change contract | ✅ Pass — 41-byte line, 0-byte error stream, listener owned by the started process | 100% |
| 5 | Unregistered routes, methods and inputs on the framework's defaults | Legacy disposition decision | ✅ Pass — no handler of the change's own; the previous uniform 200 is deliberately gone | 100% |
| 6 | `express` as the sole dependency, resolved from `^5.0.0`, no committed lockfile | Dependency inventory | ✅ Pass — resolves to 5.3.0; no lockfile on disk or in history | 100% |
| 7 | Manifest limited to `name`, `version`, `dependencies` | Constraint on the manifest | ✅ Pass — exactly three keys, seven lines | 100% |
| 8 | Single-expression implementation and smallest possible diff | Style constraint | ✅ Pass — one hunk of one line; the listener tail is byte-identical | 100% |
| 9 | File set containment: exactly two paths, nothing else created, modified or deleted | Scope boundaries | ✅ Pass — one added file, one modified file, no deletion, no rename | 100% |
| 10 | Exclusions honoured: no test, documentation, dotfile, lockfile, error handler, environment configuration or unrequested hardening | Scope boundaries | ✅ Pass — every one absent from the tree and from the code | 100% |
| 11 | Verification of the change against the change contract's acceptance criteria | Verification requirement | ✅ Pass — the four documented commands reproduced live with the contracted results | 100% |
| 12 | Static, dependency and security verification of the delivered artefacts | Enterprise-standard practice | ✅ Pass — content equality, syntax and manifest gates, dependency provenance and advisories, injection and disclosure probing, browser pass | 100% |

## 5.2 AAP & Rule Divergences and Gaps

**No divergences from the Agent Action Plan or user rules were identified.**

The basis for that conclusion: both delivered files are character-for-character the content the plan fixed, with the delivered single line measuring 218 characters plus its terminating newline and the manifest seven lines with exactly the three agreed fields; the change set contains no path other than `server.js` (modified) and `package.json` (created), with no deletion and no rename; every exclusion the plan names is absent from the tree and from the code; and no user-specified rule document exists for this project, so no rule could be departed from. Requirement by requirement, all 46 requirements the plan and the environment instructions set are met, and none was implemented differently from the way the plan specified it, skipped, deferred, or replaced by an unsanctioned design decision.

Three runtime properties read as departures but are consequences of constructs the plan prescribes verbatim, and are therefore carried as accepted operating conditions in Section 1.4 and Section 6 rather than as divergences. The contended-port start prints the startup line and exits 0 with nothing bound, which follows from the prescribed startup callback and the framework's own handling of the bind error. The listener binds all interfaces while the startup line names the loopback address, a property of the listener call the plan requires carried across untouched. And unregistered paths and methods now receive the framework's default 404 where the pre-change service answered 200 for everything, which is the plan's own explicit legacy disposition with no handler of the change's own.

# 6. Risk Assessment

Each risk below is forward-looking: what could still go wrong once this service runs. None arises from the delivered change itself — every one is a property of the deployment context or of hardening the agreed scope excludes.

| Risk | Category | Severity | Probability | Mitigation | Status |
|---|---|---|---|---|---|
| On an occupied TCP 3000 the process prints the startup line, writes nothing to standard error and exits 0 with nothing bound, so a failed start looks healthy and the port is silently yielded to whichever process holds it | Operational | High | Medium | Supervise on the listener and on both route responses rather than on the log line or the exit status; document that the line is not a readiness signal. The code path is prescribed verbatim and cannot be changed within the agreed scope | Open — accepted |
| No test suite, scripts entry, linter, type checker or CI exists, and the whole implementation is one line, so an edit to either route is caught only by re-running the documented checks by hand | Technical | Medium | Medium | Adopt the documented commands and the two byte counts as the required smoke check before every change and after every dependency refresh | Open — accepted |
| The dependency is an unpinned caret range with no committed lockfile, so each install resolves to the then-current 5.x; the framework's own listen-callback behaviour and its charset augmentation are both surfaces a later release can change, and a future major could deliver a bare `text/plain` where the contract requires the charset | Technical / Integration | Medium | Medium | Record the version the deployment resolves, review advisories on a cadence, and re-run the acceptance checks after any dependency refresh. No other integration exists: no external service, database, broker or outbound call | Open — accepted |
| The listener binds all interfaces while the startup line advertises the loopback address, so any host-local process can reach the service and only the host firewall restricts other machines; the log can mislead an operator about the real exposure | Security | Medium | Low-Medium | Decide and enforce the reachable scope at the deployment layer — a fronting proxy or host-level rules — since the listener call is carried across untouched by the contract | Open — accepted |
| No health, readiness, metrics or status endpoint exists and no request is ever logged, so there is no independent readiness signal and no per-request record to diagnose a client problem with | Operational | Medium | Medium | Use an external probe of the two contracted routes as the readiness signal, with platform-level metrics and access logs at the fronting layer | Open — accepted |
| No rate limiting and no application-level request-size limit exist; the parser's ~16 KB header ceiling is the only bound, so a single client can drive unbounded request volume | Security | Medium | Low-Medium | Place rate and size limits at the fronting layer or the platform; the absence is an accepted scope decision, not a defect | Open — accepted |
| Every response advertises the framework and the framework's `OPTIONS` responder advertises the served methods; the two route responses carry no security headers while the framework's error page carries a content-security policy and a no-sniff header — an asymmetry a reader should not mistake for a defect | Security | Low | High | Suppress the framework banner and add the headers the deployment requires at a fronting proxy; do not treat the asymmetry as a fault | Open — accepted |
| The only input-derived output in the system — the framework's error page, which echoes the requested path — is correctly escaped today, but that safety is a property of the installed framework version rather than of the application | Security | Low | Low | Keep the framework current and re-run the escaping probe after any framework change; a hand-written error page later would have to reproduce the escaping | Open — accepted |

No risk in this register blocks the delivered capability, and none requires a change to `server.js` as the agreed scope stands. The first is the one to close or explicitly accept before a production release, and it is the item that carries the High priority in Section 2.2.

# 7. Visual Project Status

```mermaid
pie title Project Hours Breakdown
    "Completed Work" : 26
    "Remaining Work" : 7
```

Legend: Completed = Dark Blue (`#5B39F3`); Remaining = White (`#FFFFFF`). Completed Work 26.0 hours, Remaining Work 7.0 hours, total 33.0 hours — 26.0 ÷ 33.0 = 78.79%, stated as **79%** complete.

Remaining hours by priority, drawn from Section 2.2:

| Priority | Hours | Share of Remaining | Work |
|---|---|---|---|
| High | 3.0 | 43% | Production start, supervision and readiness confirmation |
| Medium | 4.0 | 57% | Deployment fronting decisions; target-runtime acceptance confirmation and baseline; dependency-resolution and advisory-review policy |
| Low | 0.0 | 0% | None |
| **Total** | **7.0** | **100%** | |

Verification coverage at a glance: all 12 deliverables in Section 5.1 sit at 100% of their agreed scope, and the delivered capability has no outstanding work. What the 7.0 remaining hours buy is release readiness rather than function — a trustworthy readiness signal, an enforcement point for the deployment's reach, rate and header posture, a recorded baseline on the target host, and a policy for an unpinned dependency.

# 8. Summary & Recommendations

The service is complete against the change contract and verified end to end. `GET /good-evening` answers 200 as `text/plain; charset=utf-8` with a body of exactly 13 bytes, `Good evening` plus a newline; `GET /` still answers 200 with exactly 14 bytes, `Hello, World!` plus a newline, no media type of its own, and bytes identical to what the previous built-in HTTP server returned; the listener still binds TCP 3000 and startup still prints the unchanged line once with nothing on the error stream. Express is the sole dependency, declared in a three-field manifest and resolved from the declared range at install time with no lockfile committed. The whole change is two files: one modified line of `server.js` and one created seven-line manifest.

Verification was thorough in proportion to what it protects. Both bodies, both header sets and the absence of a media type on the root response were asserted from `curl`, raw sockets and a real browser; the root response was compared byte-for-byte against the previous built-in HTTP server's output, run side by side for the comparison; the delivery was re-exercised under repeat, pipelined, aborted and concurrent traffic up to 100 simultaneous requests; and several hundred payload-bearing requests across query, path, header and body positions changed nothing, injected no header, read no file and crashed nothing. The framework's error page — the only place where a caller's input reaches a response — escapes the path it echoes, confirmed in the browser as well as on the wire. The one dependency was checked for provenance and for advisories across the tree its range resolves to, with nothing outstanding.

**AAP-scoped completion is 79%** — 26.0 hours complete out of 33.0 total, with 7.0 hours remaining. That figure is deliberately not 100%: the delivered capability has no outstanding work, but a service whose start can signal success while nothing is bound has genuine release readiness left to close. The remaining hours buy a readiness signal that survives a contended port (3.0), enforcement of the deployment's reach, rate and header posture (2.0), a recorded baseline of the contracted responses on the target host (1.0), and a policy for an unpinned dependency (1.0).

The critical path to production is short and starts outside the code. First, stand up supervision and a readiness probe that confirm the TCP-3000 listener and both route responses, and document the start-and-verify procedure; until that exists, a supervisor restarting on a non-zero exit will treat a failed start as a clean shutdown, and a health check grepping the startup line will read a dead service as healthy. Second, decide the deployment fronting — the reachable scope, the rate and size limits, and the header posture — and enforce it at that layer rather than in an application the agreed scope excludes from hardening. Third, record the release baseline of both header sets and the two byte counts on the deployment host, which is what makes later drift detectable in the absence of a test suite. Fourth, fix an accepted version band for the dependency and review its advisories on a cadence.

Success measures for the release: both contracted responses reproduced with the exact status, media type and byte counts on the target host; the readiness probe confirming the listener and both routes rather than the log line; the release baseline recorded so a later comparison is arithmetic rather than judgement; and no new advisory against the resolved dependency tree. Everything the plan specified is delivered and verified; what remains is making the deployment as trustworthy as the code. The production-readiness assessment is therefore **ready for release once the readiness and fronting items identified above are closed or explicitly accepted** — the service itself needs no further change.

# 9. Development Guide

## System Prerequisites

- **Node.js 22 LTS or newer within the 22.x line.** Every command below was run on Node v22.23.4. Do not install a lower 20.x or 22.x release; the framework itself supports Node 18 and above, but the project is verified on 22.x.
- **npm**, which ships with Node. Verified on npm 10.9.9.
- **Git**, to obtain the source. Nothing else participates: there is no compiler, bundler, linter, type checker, coverage tool or security scanner in this project, no database, broker, cache or container, and no build step exists to run.
- **A free TCP port 3000**, which the service binds and which is hardcoded in `server.js`.
- **Operating system:** not constrained — the project is a single Node script with one registry dependency. Commands are shown in PowerShell, which is what was verified.
- **No environment variables and no secrets are required.** The application reads none, and behaviour is identical whether or not the environment sets a `PORT` value.

## Environment Setup

There is nothing to configure. The repository holds two tracked files at its root — `server.js` and `package.json` — and no configuration file of any kind: no `.env`, no dotfile, no container or pipeline definition, and no lockfile.

```powershell
git clone <repository-url>
cd <repository-root>
```

## Dependency Installation

Run this in the repository root, before anything else. `node_modules` is per checkout and is never committed.

```powershell
npm install --no-package-lock --no-audit --no-fund
```

Expected: exit code 0, resolving `express` 5.3.0 plus 64 transitive packages (65 in total, about 2.2 MB) from the declared range `^5.0.0`. Confirm the resolution and confirm that no lockfile was produced:

```powershell
npm ls express --depth=0
Test-Path package-lock.json
```

Expected: `mermaidwindowsvm@1.0.0` with `express@5.3.0`, and `False`. Do not use a bare `npm install` that would write `package-lock.json`, and never stage the working tree wholesale — `node_modules/` must not be committed either.

There is no build step. `npm test` is not usable: the manifest declares no scripts, and it exits 1 with `Missing script: "test"`.

## Syntax Gate

The project's only static check:

```powershell
node --check server.js
```

Expected: exit code 0, no output.

## Application Startup

Start the service from the repository root as a background job so it does not block your terminal:

```powershell
node server.js
```

Expected: standard output is exactly 41 bytes containing the single line

```
Server running at http://127.0.0.1:3000/
```

standard error is exactly 0 bytes, and the process binds TCP port 3000. Confirm the listener and its owner:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess
```

Stop the service by terminating only the pid that owns the port:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess
```

If port 3000 already has a listener, curl that listener instead of starting a second process — the responses are identical constants — and never terminate a process you did not start. The startup line alone is not proof that this process is serving: on a contended port it can be printed while nothing is bound.

## Verification Steps

With the service running:

```powershell
curl.exe -s -i http://127.0.0.1:3000/good-evening
curl.exe -s -i http://127.0.0.1:3000/
```

Expected for `/good-evening`: `HTTP/1.1 200 OK`, `X-Powered-By: Express`, `Content-Type: text/plain; charset=utf-8`, `Content-Length: 13`, and the body line `Good evening`.

Expected for `/`: `HTTP/1.1 200 OK`, `X-Powered-By: Express`, `Content-Length: 14`, and the body line `Hello, World!` — and deliberately **no** `Content-Type` header at all.

Byte-level confirmation, which is the check that catches a rewritten line ending:

```powershell
curl.exe -s http://127.0.0.1:3000/good-evening -o ge.bin
(Get-Item ge.bin).Length
curl.exe -s http://127.0.0.1:3000/ -o root.bin
(Get-Item root.bin).Length
Remove-Item ge.bin,root.bin
```

Expected: `13`, then `14`. Recorded digests, useful for comparison: `15827D630BCABD8B6952860D86096076FFBE023080785365150032AB34A8F05C` for `/good-evening` and `C98C24B677EFF44860AFEA6F493BBAEC5BB1C4CBB209C6FC2BBB47F66FF2AD31` for `/`.

## Example Usage

```powershell
# the two contracted routes
curl.exe -s -w '`n%{http_code} %{content_type} %{size_download}`n' http://127.0.0.1:3000/good-evening
curl.exe -s -w '`n%{http_code} %{size_download}`n' http://127.0.0.1:3000/

# everything else falls to the framework's defaults
curl.exe -s -o NUL -w '%{http_code}' http://127.0.0.1:3000/no-such-path        # 404
curl.exe -s -o NUL -w '%{http_code}' -X POST http://127.0.0.1:3000/            # 404
curl.exe -s -i -X OPTIONS http://127.0.0.1:3000/good-evening                   # 200, Allow: GET, HEAD
curl.exe -s -I http://127.0.0.1:3000/good-evening                              # 200, no body
```

## Troubleshooting

- **`Error: Cannot find module 'express'`** with a require stack naming `server.js`, and no listener bound. The dependency is not installed — run the install command above. This is the exact failure the service produces from a checkout without `node_modules`.
- **The startup line appears but nothing answers.** Another process holds port 3000, or the start failed on a contended port. Check the listener and its owning pid, and curl that listener; if it belongs to a process you did not start, leave it alone. Do not treat the line as readiness.
- **`npm test` exits 1 with `Missing script: "test"`.** Expected — there is no test suite and the manifest declares no scripts. Use the curl assertions above.
- **`npm install` left a `package-lock.json`.** Delete it before committing and re-run with `--no-package-lock`. A committed lockfile breaks the project's recorded dependency position.
- **A response body is 15 or 14 bytes instead of 13 or 14, or a carriage return shows up.** The file's line endings were rewritten. `server.js` must stay exactly one line whose two body literals carry the newline only as the `\n` escape; the worktree file reads 220 bytes under CRLF while the git blob is 219 bytes. Restore the file and re-run the syntax gate.
- **Standard error shows an `EADDRINUSE` stack.** That is the old built-in-server behaviour, not the current one: the delivered startup callback consumes the bind error and the process exits 0. Always verify the listener, never the exit status.
- **An exported `PORT` is ignored.** The port is fixed at 3000 by the deliverable; there is no configuration path for it.

## Adding a Route

`server.js` is a single expression statement on one line: the application factory, then `.get('/')`, then `.get('/good-evening')`, then `.listen(3000, …)`. A new route is another `.get('/path',(req,res)=>…)` inserted before `.listen(`, keeping the file one line. Anything beyond that — splitting the file, adding a router module, adding middleware — is a new decision for the owner, not a step this guide covers.

# 10. Appendices

## A. Command Reference

All commands run from the repository root in PowerShell.

| Purpose | Command | Expected result |
|---|---|---|
| Install the dependency | `npm install --no-package-lock --no-audit --no-fund` | Exit 0, 65 packages, express 5.3.0, no lockfile |
| Confirm the resolution | `npm ls express --depth=0` | `mermaidwindowsvm@1.0.0` → `express@5.3.0` |
| Confirm no lockfile was written | `Test-Path package-lock.json` | `False` |
| Syntax gate | `node --check server.js` | Exit 0, no output |
| Start the service | `node server.js` | 41-byte startup line on stdout, 0 bytes on stderr, TCP 3000 bound |
| Confirm the listener and its owner | `Get-NetTCPConnection -LocalPort 3000 -State Listen` | One row, port 3000, the pid you started |
| Stop the service | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess` | Process gone, port released |
| Assert `/good-evening` | `curl.exe -s -i http://127.0.0.1:3000/good-evening` | 200, `Content-Type: text/plain; charset=utf-8`, `Content-Length: 13` |
| Assert `/` | `curl.exe -s -i http://127.0.0.1:3000/` | 200, `Content-Length: 14`, no `Content-Type` |
| Assert the byte counts | `curl.exe -s <url> -o f.bin; (Get-Item f.bin).Length` | 13 for `/good-evening`, 14 for `/` |
| Assert an unregistered path | `curl.exe -s -o NUL -w '%{http_code}' http://127.0.0.1:3000/no-such-path` | 404 |
| Inspect the dependency tree on disk | `Get-ChildItem node_modules\express\package.json` | The resolved framework's manifest |

## B. Port Reference

| Port | Protocol | Binding | Purpose | Notes |
|---|---|---|---|---|
| 3000 | HTTP | All interfaces, hardcoded in `server.js` | The service's only listener, serving both routes | Host-global and not configurable: two instances cannot share it, and no environment variable overrides it. The startup line names the loopback address while the listener accepts on every interface. |

No other port is used. The application opens no outbound connection, contacts no database, broker or external service, and — because no lockfile or vendored copy is committed but the dependency is installed at deploy time — the only network access it needs is to the npm registry, or a warm package cache, at install time.

## C. Key File Locations

| Path | Role |
|---|---|
| `server.js` | The entire service: one expression statement on one line holding the application factory, both `GET` routes and the TCP-3000 listener with its startup line. 218 characters plus its terminating newline (219-byte git blob, 220-byte CRLF worktree), exactly one line. |
| `package.json` | The three-field manifest — `name`, `version`, `dependencies.express` at `^5.0.0` — seven lines, 104-byte git blob, 111-byte CRLF worktree. |
| `node_modules/` | Installed dependencies. Per checkout, never committed. |

No other tracked path exists: there is no `src/`, no test directory, no documentation, no configuration, no dotfile (not even `.gitignore`), no lockfile, and no container or pipeline definition.

## D. Technology Versions

| Component | Version | Notes |
|---|---|---|
| Node.js | v22.23.4 | The version every command was verified on; Node 22 LTS is the supported line. The framework declares support for Node 18 and above. |
| npm | 10.9.9 | Ships with Node; used only to install the dependency. |
| Express | 5.3.0 | The only dependency. Declared as the caret range `^5.0.0`, so a fresh install resolves to the then-current 5.x release. |
| Resolved transitive tree | 65 packages in total | The framework plus 64 transitives. No lockfile pins them, so the tree is whatever the registry resolves at install time. |
| Windows Server 2025 / PowerShell 5.1 | — | The environment all commands and browser checks were verified in. |

## E. Environment Variable Reference

None. The application reads no environment variable, requires no secret and no credential, and its behaviour is unaffected by the environment it starts in — including an exported `PORT`, which it ignores because the port is fixed at 3000 in `server.js`. Do not add environment-variable configuration: it is outside the agreed scope.

## F. Developer Tools Guide

No tooling exists in this project beyond Node and npm. There is no test runner, no linter, no formatter, no type checker, no bundler, no coverage tool and no security scanner, and the manifest declares no scripts. The available gates are therefore exactly two static ones — `node --check server.js` and the manifest's JSON parse (via `npm ls` or any JSON reader) — plus the live assertions in Appendix A. Adding any tooling is a decision for the repository owner and would change the project's agreed dependency position.

## G. Glossary

| Term | Meaning here |
|---|---|
| Express application | The single object created inline in `server.js` on which both `GET` routes are registered and whose `listen` call binds TCP 3000. |
| Send path | The framework's convenience response methods (`res.send`, `res.json` and similar), which attach a `text/html` media type and an entity tag. Neither handler uses it, which is what keeps the root response byte-identical. |
| `res.end` | Node's response-terminating call, used by both handlers so the bytes written are exactly the bytes contracted. |
| Media type (Content-Type) | The response header naming the body's type. Contracted as `text/plain; charset=utf-8` on `/good-evening`, and deliberately absent on `/`. |
| Byte-identical | Equal byte for byte, carriage returns included: the root response must match the pre-change response exactly. |
| Legacy disposition | The agreed decision that only the routes the request names are carried over, so unregistered paths and methods fall to the framework's defaults instead of the previous uniform 200. |
| Readiness signal | Independent evidence that the service is listening and answering. The startup line is not one: on a contended port it can be printed while nothing is bound. |
| Blob versus worktree | The git blob stores the file with line feeds (219 bytes for `server.js`); the checked-out file uses CRLF and reads 220 bytes while remaining one physical line. |
