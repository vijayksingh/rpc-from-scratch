// TODO: Implement in Lesson 03
// This scaffold intentionally lacks implementation to support TDD.
// Tests should fail until you complete the functions below.

import { ZodTypeAny } from 'zod';

type ProcedureKind = 'query' | 'mutation'

type ProcedureHandler<I, R, Ctx> = (args: { input: I; ctx: Ctx }) => Promise<R> | R

interface ProcedureDefinition<I, R, Ctx> {
  kind: ProcedureKind
  schema?: ZodTypeAny
  handler?: ProcedureHandler<I, R, Ctx>
}

export function createProcedure<I = unknown, R = unknown, Ctx = Record<string, unknown>>() {
  const def: ProcedureDefinition<I, R, Ctx> = { kind: 'query' }

  return {
    input(_schema: ZodTypeAny) {
      throw new Error('Not implemented')
    },
    query(_handler: ProcedureHandler<I, R, Ctx>) {
      throw new Error('Not implemented')
    },
    mutation(_handler: ProcedureHandler<I, R, Ctx>) {
      throw new Error('Not implemented')
    },
    async call(_args: { input: I; ctx: Ctx }): Promise<R> {
      throw new Error('Not implemented')
    }
  }
}


