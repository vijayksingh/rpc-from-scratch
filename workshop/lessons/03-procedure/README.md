# Lesson 03: Procedure Definition System

## Why this lesson?
We need a way to define RPC endpoints with runtime validation and strong types. A procedure builder clarifies inputs/outputs and unifies query vs mutation semantics.

## Mental model
- Define a procedure with `.input(schema)` to validate incoming data.
- Attach an implementation via `.query` or `.mutation` that receives `{ input, ctx }`.
- At runtime, invalid input returns a 400 error envelope; valid input executes the handler.

## What you'll build
- A minimal `createProcedure()` builder with:
  - `.input(schema)` (Zod schema)
  - `.query(handler)` / `.mutation(handler)`
  - Internal metadata for router registration (next lesson)

## Files you'll edit
- `src/core/procedure.ts` (scaffold to be implemented)

## How to run
- Focused tests: `npm run test:procedure`

## Objective
Create a procedure builder that validates input at runtime and infers handler types.

## Constraints
- Use Zod for runtime validation; preserve static types.
- Return structured validation error envelopes (code 400) when invalid.

## Step-by-step (suggested)
1. Implement `createProcedure()` returning a builder object.
2. Support `.input(schema)` storing the schema.
3. Support `.query(handler)` and `.mutation(handler)` storing type and handler.
4. Expose a `call({ input, ctx })` that validates and runs the handler.

## Tests (Red)
- Invalid input returns 400 with a clear message.
- Valid input calls handler with typed `input`.
- `.mutation` vs `.query` are distinguishable via metadata.

## Pitfalls to avoid
- Losing type inference from Zod to handler.
- Returning raw exceptions instead of error envelopes.

## Acceptance (Green)
All procedure tests pass; types line up; invalid input returns 400.

## Refactor
Extract utility types and keep builder API small.

## Learn
Record validation trade-offs and type inference notes in Architecture Decisions.

## Rubric
- Correctness (tests pass), clarity (clean builder API), safety (runtime validation), types (inferred handler args).
