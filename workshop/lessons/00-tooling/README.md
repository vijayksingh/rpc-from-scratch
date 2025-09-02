# Lesson 00: Tooling & Test Harness

## Objective
Stand up the test environment and commands used by every lesson.

## Constraints
- No domain logic; only configuration and scripts.

## Steps (TDD)
- Red: Add a smoke test expecting Jest to run.
- Green: Install Jest stack, add config, make the test pass.
- Refactor: Tidy scripts and config.
- Learn: Why focused tests and coverage policy help learning.

## Acceptance
- `npm run test` executes and reports.
- Focused run like `npm run test:serializer` works.

## Stretch
- Coverage config ignores non-touched files.
