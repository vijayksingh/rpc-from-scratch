import { z, ZodTypeAny } from 'zod';

type ProcedureKind = 'query' | 'mutation'

type ProcedureHandler<I, R, Ctx> = (args: { input: I; ctx: Ctx }) => Promise<R> | R

interface ProcedureDefinition<I, R, Ctx> {
  kind: ProcedureKind
  schema?: ZodTypeAny
  handler?: ProcedureHandler<I, R, Ctx>
}

export function createProcedure<I = unknown, R = unknown, Ctx = Record<string, unknown>>() {
  const def: ProcedureDefinition<I, R, Ctx> = { kind: 'query' }

  const api = {
    input<T extends ZodTypeAny>(schema: T) {
      ; (def as any).schema = schema
      return api as any as ReturnType<typeof createProcedure<z.infer<T>, R, Ctx>>
    },
    query(handler: ProcedureHandler<I, R, Ctx>) {
      def.kind = 'query'
      def.handler = handler
      return api
    },
    mutation(handler: ProcedureHandler<I, R, Ctx>) {
      def.kind = 'mutation'
      def.handler = handler
      return api
    },
    async call(args: { input: I; ctx: Ctx }): Promise<R> {
      try {
        if (def.schema) {
          const parsed = (def.schema as any).parse(args.input) as I
          args = { ...args, input: parsed }
        }
      } catch (e: any) {
        const error: any = { code: 400, message: 'Validation failed', data: e?.issues }
        throw error
      }
      if (!def.handler) {
        throw new Error('Handler not defined')
      }
      return await def.handler(args)
    }
  }

  return api
}


