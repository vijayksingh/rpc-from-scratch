# SimpleRPC Learning Journey 🎓

## What is RPC? The Core Problem

**Remote Procedure Call (RPC)** lets you call functions on another machine as if they were local functions.

### The Magic We Want to Achieve:
```typescript
// Instead of this (traditional API):
const response = await fetch('/api/users/42')
const user = await response.json()

// We want this (RPC magic):
const user = await api.getUser({ id: 42 })  // Looks local, runs remotely!
```

## Why Build Our Own RPC?

1. **Learn the internals** - Understand how tRPC, gRPC, JSON-RPC work under the hood
2. **Type safety** - See how TypeScript makes remote calls feel local
3. **Simplicity** - Build minimal version focusing on core concepts

## The Fundamental RPC Problems to Solve

### Problem 1: How do we represent a function call over the network?
**Challenge**: Functions exist in memory, networks only transport data

**Solution**: Convert function calls to messages
```typescript
// Local call: getUser(42)
// Becomes message: { method: "getUser", params: { id: 42 } }
```

### Problem 2: How do we match responses to requests?
**Challenge**: Multiple requests can be in-flight simultaneously

**Solution**: Unique IDs
```typescript
// Request:  { id: "abc123", method: "getUser", params: { id: 42 } }
// Response: { id: "abc123", result: { name: "John", id: 42 } }
```

### Problem 3: How do we handle errors?
**Challenge**: Remote functions can fail in ways local functions can't

**Solution**: Structured error responses
```typescript
// Error response: { id: "abc123", error: { code: 404, message: "User not found" } }
```

## Our Architecture Overview

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   CLIENT    │    │    NETWORK      │    │   SERVER    │
│             │    │                 │    │             │
│ ┌─────────┐ │    │ ┌─────────────┐ │    │ ┌─────────┐ │
│ │ Proxy   │ │───▶│ │ HTTP/JSON   │ │───▶│ │ Router  │ │
│ │         │ │    │ │ Transport   │ │    │ │         │ │
│ └─────────┘ │    │ └─────────────┘ │    │ └─────────┘ │
│             │    │                 │    │             │
│ ┌─────────┐ │    │ ┌─────────────┐ │    │ ┌─────────┐ │
│ │ Types   │ │    │ │ Serializer  │ │    │ │ Handlers│ │
│ └─────────┘ │    │ └─────────────┘ │    │ └─────────┘ │
└─────────────┘    └─────────────────┘    └─────────────┘
```

---

# What We've Built So Far

## Step 1: Project Structure ✅
**What**: Basic TypeScript project with proper folder organization

**Why**: Professional setup makes development easier and code maintainable

**Files Created**:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- Folder structure: `src/{core,examples,types}`

## Step 2: RPC Message Types ✅
**What**: Defined the shape of RPC messages

**Why**: Every RPC system needs a protocol - a standard format for messages

**File**: `src/types/rpc.ts`
```typescript
// Request message format
interface RPCRequest {
  id: string      // Unique identifier 
  method: string  // Function name to call
  params: any     // Function arguments
}

// Response message format  
interface RPCResponse {
  id: string       // Matches request ID
  result?: any     // Success data
  error?: {...}    // Error details
}
```

**Key Learning**: This is the "contract" between client and server. Both sides must understand this format.

## Step 3: Serialization System ✅
**What**: Convert JavaScript objects ↔ network strings

**Why**: Networks transport bytes/strings, not JavaScript objects

**File**: `src/core/serializer.ts`

**The Problem**:
```javascript
// JavaScript object (exists in memory)
const request = { id: "123", method: "getUser", params: { id: 42 } }

// Network transmission (must be string/bytes)  
"???" // How do we convert?
```

**Our Solution - JSON**:
```javascript
// Serialize: Object → String
JSON.stringify(request) // → '{"id":"123","method":"getUser","params":{"id":42}}'

// Deserialize: String → Object
JSON.parse(jsonString) // → { id: "123", method: "getUser", params: { id: 42 } }
```

**Why JSON?**: Human-readable, widely supported, easy to debug

**Test Results**: ✅ Objects successfully convert to/from JSON strings

## Step 4: Transport Layer ✅
**What**: Send/receive messages over HTTP

**Why**: We need a way to physically move messages between processes

**File**: `src/core/transport.ts`

**The Problem**: How do we get our serialized messages from Client to Server?

**Our Solution - HTTP**:
- **Server side**: HTTP server that listens for POST requests
- **Client side**: HTTP client that sends POST requests
- **Format**: JSON in HTTP body

**Why HTTP?**: 
- Simple and familiar
- Works through firewalls/proxies
- Built into every programming language
- Same approach as tRPC

**Test Results**: ✅ Client and server successfully exchange RPC messages

---

# Current Understanding Check 🧠

Before we continue, let's make sure the foundation is clear:

## Questions for You:
1. **Message Flow**: Can you trace how a request flows from client → server → back?

2. **ID Purpose**: Why is the `id` field critical? What would break without it?

3. **Serialization**: Why can't we just send JavaScript objects directly over HTTP?

4. **HTTP Choice**: Why did we choose HTTP POST instead of GET for all RPC calls?

## Try This Exercise:
Look at our test output and identify:
- Where does serialization happen?
- Where does deserialization happen?  
- How does the server know which method to call?
- How does the client know which response belongs to which request?

---

# Next Steps (What We'll Build)

## Step 5: Procedure Definition System (NEXT)
**Goal**: Create type-safe function definitions with validation

**Challenge**: How do we define remote functions that feel local?

**Planned Approach**:
```typescript
// We want to enable this:
const getUserProcedure = createProcedure()
  .input(z.object({ id: z.number() }))  // Input validation
  .query(({ input }) => {               // Implementation
    return { id: input.id, name: "John" }
  })
```

## Step 6: Client Proxy (Type Magic)
**Goal**: Make remote calls look like local function calls

**Challenge**: How do we generate type-safe client methods?

## Step 7: Server Router
**Goal**: Route incoming requests to the right procedure

**Challenge**: How do we map method names to actual functions?

## Step 8: Full Demo
**Goal**: Complete working example with multiple procedures

---

# Debugging Guide

When things go wrong, check:

1. **Serialization Issues**: Are objects converting to/from JSON properly?
2. **Network Issues**: Is the HTTP request reaching the server?
3. **ID Matching**: Do request and response IDs match?
4. **Method Mapping**: Does the server recognize the method name?

---

*This lesson plan will be updated as we build more features!*

---

## TDD Workflow (Workshop Contract)

Red → Green → Refactor → Learn

- Red: Write failing tests that define the problem and constraints
- Green: Implement minimal code to pass
- Refactor: Clean up while keeping tests green
- Learn: Document trade-offs and decisions (link to Architecture Decisions)

This cycle is applied to every lesson with tight, atomic scope.

---

## Lessons Overview (Locked Scopes)

### Lesson 00: Tooling & Harness (New)
- Objective: Stand up Jest + ts-jest and focused commands used by all lessons
- Constraints: No domain logic; only configuration and scripts
- Acceptance:
  - `npm run test` executes and reports
  - Focused runs work (e.g., `npm run test:serializer`)
  - TypeScript sources compile under test
- Stretch: Coverage config ignores non-touched files

### Lesson 01: Serializer (Current)
- Objective: Strict JSON serialization/deserialization for `RPCRequest` and `RPCResponse`
- Constraints:
  - JSON only; no schema libs yet
  - Requests must include `id`, `method`, `params`
  - Responses include exactly one of `result` or `error`
  - Deserialization rejects messages missing `id`
- Tests (examples):
  - Serialize/deserialize round-trip preserves equality
  - Missing `id` throws `Invalid RPC message: missing id`
  - `createResponse` and `createErrorResponse` enforce exclusivity
- Acceptance: All serializer tests pass; error messages are informative and stable
- Stretch: Fuzz nested shapes; optional `error.data`

### Lesson 02: Transport
- Objective: JSON-over-HTTP POST round-trip between client and server.
- Constraints:
  - Use Node `http` only; no frameworks.
  - CORS preflight support, 405 for non-POST.
- Tests (Red):
  - Echo handler returns structured `result`.
  - Non-POST returns 405 JSON body.
  - OPTIONS handled for CORS.
  - Handler throw maps to 500 error envelope.
  - Client timeout fails with error envelope (configurable or default).
- Acceptance (Green): All tests pass; logs are present but responses do not leak stacks.
- Stretch: Configurable timeout, `Content-Type` guard, request body size limit.

### Lesson 03: Procedure Definition System
- Objective: `createProcedure()` builder with `.input(schema)` and `.query/.mutation`.
- Constraints:
  - Use Zod for runtime validation; preserve static types.
- Tests (Red):
  - Invalid input produces 400 validation error envelope.
  - Valid input reaches handler with typed `input`.
  - `.mutation` and `.query` registered with correct `ProcedureType`.
- Acceptance (Green): Type inference for handler args matches schema; runtime validation enforced.
- Stretch: `.output(schema)` to validate responses.

### Lesson 04: Router
- Objective: Map `method` names to procedures and dispatch requests with context.
- Constraints:
  - Unknown method returns 404 error envelope.
  - Always echo request `id` in responses.
- Tests (Red):
  - Unknown method 404.
  - Handler error mapped to 500 (or specific mapped codes).
  - Context is passed through to handler.
- Acceptance (Green): Transport server uses router to process calls.
- Stretch: Namespacing of methods.

### Lesson 05: Client Proxy
- Objective: Typed client that exposes procedures as local-feeling methods.
- Constraints:
  - Uses transport under the hood; no global state.
- Tests (Red):
  - `api.getUser({ id })` returns typed result.
  - Wrong inputs fail at compile-time (type tests) and at runtime (Zod).
- Acceptance (Green): Minimal dynamic proxy with correct types.
- Stretch: Namespaced client.

### Lesson 06: Error Semantics
- Objective: Standardize error codes and redaction.
- Constraints:
  - No stack traces in responses; log internally.
- Tests (Red):
  - 400 for validation, 404 for unknown method, 500 for internal.
  - Error shape `{ code, message, data? }` stable.
- Acceptance (Green): Consistent error envelopes across layers.
- Stretch: Error subclasses with code mapping.

### Lesson 07: Context & Middleware
- Objective: Request-scoped context and middleware pipeline.
- Tests (Red):
  - Middleware order (pre → handler → post).
  - Short-circuit from middleware.
  - Context mutation visible to handler.
- Acceptance (Green): Router composes middlewares in order.
- Stretch: Per-procedure middleware.

### Lesson 08: Batching, Idempotency, Timeouts
- Objective: Batch arrays of requests; ensure idempotency; per-call timeout fallback.
- Tests (Red):
  - Mixed success/error within a batch.
  - Duplicate mutation suppressed by idempotency key.
  - Per-call timeout returns error envelope.
- Acceptance (Green): Batch endpoint with stable shapes.
- Stretch: Concurrency limits for batch processing.

### Lesson 09: End-to-End Demo
- Objective: Complete demo with multiple procedures and concurrency test.
- Tests (Red):
  - Client → transport → router → procedure → response round-trips.
  - 20 in-flight requests succeed and match by `id`.
- Acceptance (Green): Demo script prints expected outputs; suite all green.

---

## Dogfooding Loop (Each Lesson)

- Run focused tests (e.g., `npm run test:serializer`)
- Execute example scripts under `src/examples` when provided
- Append short notes tying trade-offs back to Architecture Decisions