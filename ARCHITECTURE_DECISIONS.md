# Architecture Decisions & Reasoning 🏗️

## Why We Made Each Choice

### 1. Why JSON over Binary Protocols?

**Our Choice**: JSON serialization
**Alternatives**: Protocol Buffers, MessagePack, custom binary

**Reasoning**:
- ✅ **Learning**: Human-readable, easy to debug
- ✅ **Simplicity**: Built into JavaScript/TypeScript
- ✅ **Universality**: Every language supports JSON
- ❌ **Performance**: Larger size, slower parsing (acceptable for learning)

### 2. Why HTTP over Raw TCP?

**Our Choice**: HTTP POST requests
**Alternatives**: TCP sockets, WebSockets, UDP

**Reasoning**:
- ✅ **Simplicity**: Built-in request/response pattern
- ✅ **Tooling**: Easy to debug with curl, browser dev tools
- ✅ **Infrastructure**: Works with load balancers, proxies
- ✅ **Familiar**: Most developers understand HTTP
- ❌ **Overhead**: HTTP headers add size (acceptable for learning)

### 3. Why POST for Everything?

**Our Choice**: All RPC calls use POST
**Alternatives**: GET for queries, POST for mutations

**Reasoning**:
- ✅ **Consistency**: Same pattern for all calls
- ✅ **Parameters**: Complex objects in body, not URL
- ✅ **Security**: No sensitive data in URL logs
- ✅ **Standard**: Follows JSON-RPC and tRPC patterns

### 4. Why Unique IDs for Requests?

**Our Choice**: String IDs for each request
**Alternatives**: No IDs (synchronous only), sequence numbers

**Reasoning**:
- ✅ **Concurrency**: Multiple requests can be in-flight
- ✅ **Matching**: Link responses to correct requests
- ✅ **Debugging**: Easy to trace request/response pairs
- ✅ **Client-generated**: No coordination needed with server

### 5. Why TypeScript over JavaScript?

**Our Choice**: TypeScript with strict mode
**Alternatives**: Plain JavaScript, Flow

**Reasoning**:
- ✅ **Learning Goal**: Understand type-safe RPC
- ✅ **Error Prevention**: Catch mistakes at compile time
- ✅ **Developer Experience**: Autocomplete and refactoring
- ✅ **Modern Standard**: Industry best practice

---

## Design Patterns We're Following

### 1. **Layer Separation**
```
Application Layer  ← Your business logic
RPC Layer         ← Procedures and routing  
Protocol Layer    ← Request/response format
Transport Layer   ← HTTP communication
Serialization     ← JSON conversion
```

**Why**: Each layer has single responsibility, easier to test and modify

### 2. **Request-Response Pattern**
Every call has:
- Unique ID for matching
- Method name for routing  
- Parameters for data
- Result or error response

**Why**: Simple, predictable, easy to debug

### 3. **Promise-Based Async**
```typescript
const result = await client.getUser({ id: 42 })
```

**Why**: Modern JavaScript pattern, handles network delays naturally

---

## What We're NOT Building (and Why)

### ❌ Authentication/Authorization
**Reason**: Focus on core RPC concepts first
**Real-world**: Would add middleware for auth tokens

### ❌ Connection Pooling  
**Reason**: HTTP already handles this
**Real-world**: Important for high-performance systems

### ❌ Load Balancing
**Reason**: Infrastructure concern, not RPC core
**Real-world**: Usually handled by reverse proxies

### ❌ Schema Versioning
**Reason**: Complexity would obscure learning
**Real-world**: Critical for evolving APIs

### ❌ Streaming/Subscriptions
**Reason**: Adds significant complexity
**Real-world**: Would use WebSockets or Server-Sent Events

---

## Learning Progression Logic

### Phase 1: Foundation (CURRENT)
Build the "plumbing" - message format, serialization, transport
**Goal**: Understand how data moves between processes

### Phase 2: Procedure System (NEXT)  
Add type-safe function definitions and validation
**Goal**: Understand how remote functions are defined

### Phase 3: Client Magic
Create the "proxy" that makes remote calls feel local
**Goal**: Understand TypeScript inference and code generation

### Phase 4: Server Routing
Build the dispatcher that routes requests to procedures  
**Goal**: Understand service architecture

### Phase 5: Integration
Put it all together with real examples
**Goal**: See the complete system working

---

*Each phase builds on the previous, following the actual data flow from client to server*

---

## Testing & Tooling Decisions (Workshop)

### 1. Test Framework
**Our Choice**: Jest + ts-jest + ts-node

**Reasoning**:
- ✅ TypeScript-native testing with fast feedback
- ✅ Snapshot-free, behavior-driven specs
- ✅ Focused test runs per lesson

### 2. Coverage Policy
**Our Choice**: Focus coverage on files touched by the current lesson

**Reasoning**:
- ✅ Keeps attention on the concept being learned
- ✅ Avoids noise from unrelated files

### 3. Error Contract
**Our Choice**: `RPCResponse.error` with `{ code, message, data? }`

**Reasoning**:
- ✅ Consistent across transport and procedures
- ✅ Prevents leaking server internals in responses

### 4. Request IDs
**Our Choice**: Client-generated string IDs (deterministic in tests)

**Reasoning**:
- ✅ Easy matching of responses to requests
- ✅ Enables concurrent in-flight requests

---

## Procedure & Router Decisions

### 1. Procedure Builder
**Our Choice**: Zod-backed `.input(schema)` with `.query/.mutation` methods.

**Reasoning**:
- ✅ Runtime validation plus strong compile-time inference
- ✅ Mirrors common RPC frameworks (tRPC-like)

### 2. Router
**Our Choice**: Name → procedure map with context threading.

**Reasoning**:
- ✅ Explicit registration and dispatch
- ✅ Clear unknown-method handling (404)

## Client Proxy Decisions

**Our Choice**: Generated proxy that mirrors procedures as methods.

**Reasoning**:
- ✅ Local-call ergonomics
- ✅ Centralizes transport concerns (timeouts, headers)

## Validation Strategy

**Our Choice**: Zod for inputs (and optional outputs), TypeScript for static types.

**Reasoning**:
- ✅ Balanced runtime safety and developer UX

## Transport Policies

**Our Choice**: Node `http` with POST-only, CORS preflight, timeouts, and body size limits.

**Reasoning**:
- ✅ Simplicity and transparency for learning
- ✅ Avoid accidental complexity from frameworks

## Middleware & Context

**Our Choice**: Ordered middleware pipeline that can short-circuit and mutate context.

**Reasoning**:
- ✅ Teaches cross-cutting concerns cleanly

## Batching & Idempotency

**Our Choice**: Batch arrays of requests; optional idempotency keys for mutations.

**Reasoning**:
- ✅ Demonstrates real-world performance and safety patterns without overbuilding