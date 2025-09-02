import { z } from 'zod'
import { createProcedure } from '../src/core/procedure'

describe('Procedure builder', () => {
  test('validates input and returns 400 on invalid', async () => {
    const proc = createProcedure()
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => ({ ok: true, id: input.id }))

    const call = proc.call({ input: { id: 'oops' } as any, ctx: {} })
    await expect(call).rejects.toMatchObject({ code: 400 })
  })

  test('passes typed input to handler on valid data', async () => {
    const proc = createProcedure()
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => ({ ok: true, id: input.id }))

    const result = await proc.call({ input: { id: 42 }, ctx: {} })
    expect(result).toEqual({ ok: true, id: 42 })
  })
})


