# Lesson 01: Serializer

## Why this lesson?
Networks move bytes, not JavaScript objects. To call remote functions, we must encode requests and decode responses. This lesson builds the JSON "wire format" for our RPC messages.

## What you'll build
- A small `RPCSerializer` that converts `RPCRequest`/`RPCResponse` objects to/from JSON strings
- Helpers to construct request, success, and error messages safely

## Files you'll edit
- `src/core/serializer.ts` (currently a scaffold that throws "Not implemented")

## How to run
- Focused tests: `npm run test:serializer`
- All tests: `npm run test` (expect failures until you implement this lesson)

## Objective
Implement strict JSON serialization/deserialization for RPC messages.

## Constraints
- JSON only; no schema libraries.
- Requests include `id`, `method`, `params`.
- Responses include exactly one of `result` or `error`.
- Deserialization rejects messages missing `id`.

## Tests (Red)
- Serializes a valid `RPCRequest` to string; JSON deep-equals original.
- Deserializes a valid request string back to object.
- Deserializing a message without `id` throws `Invalid RPC message: missing id`.
- `createResponse` includes only `result`.
- `createErrorResponse` includes only `error`.
- Round-trip preserves equality for nested params.

## Acceptance (Green)
All serializer tests pass; error messages are informative and stable.

## Refactor
Improve naming/structure without changing behavior.

## Learn
Document trade-offs (JSON vs binary) in Architecture Decisions.

## Dogfooding
- Run `npm run dev:serializer` to visualize logs.
- Run focused tests: `npm run test:serializer`.
