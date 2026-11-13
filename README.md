# Next.js RSC cancellation: destination-write error

Minimal App Router reproduction, organised like Next.js's reproduction template.
No database, login, environment configuration, private dependencies or application data.

## Reproduce

Requires Node.js 22+ (verified with 24.18.0).

```sh
npm ci
npm run dev
```

In a second terminal:

```sh
npm run reproduce
```

The script reads the first chunk of five RSC responses then aborts each request.
The server should treat this as normal client cancellation. With unmodified
Next.js 16.4.6, it instead reports:

```text
Error: The destination stream errored while writing data.
REPRO_REQUEST_ERROR {"name":"Error","message":"The destination stream errored while writing data.","path":"/?attempt=1&_rsc=","renderSource":"react-server-components-payload"}
```

Verified on macOS arm64, Node 24.18.0, Next 16.4.6, React/React DOM 19.2.8.
All five aborted requests reproduced the warning in a clean install, without
any dependency patch. Ordinary non-aborted rendering completes normally.

For a production-mode comparison, stop dev, run `npm run build` and
`npm run start`, then run the same reproduction. That mode is not claimed
verified by this initial stable-development reproduction.

## Explanation

A Suspense child delays rendering for five seconds so the RSC stream remains
open. `instrumentation.js` reports the original error classification seen by
Next.js. `reproduce.mjs` verifies the response content type and nonempty first
chunk before aborting; a redirect or empty response cannot count as success.

The suspected cause is error-before-close ordering in `renderToNodeFlightStream`:
React replaces an emitted `ResponseAborted` with a generic Error before Next's
existing close handler preserves the reason. Registering an error listener that
calls `pipeable.abort(error)` before piping preserved the reason in a separate
local experiment. This repository intentionally contains no patch or workaround.

Related upstream issue: https://github.com/vercel/next.js/issues/96704
Related earlier fix: https://github.com/vercel/next.js/pull/96715

Prepared with AI assistance at the account owner's request. Contains only
synthetic reproduction code; no Friday or other private product source.
