import { z } from 'zod'
import { createProcedure } from '../src/core/procedure'
import { createRouter } from '../src/core/router'

describe('Router', () => {
  test('unknown method returns 404 with echoed id', async () => {
    const router = createRouter()
    const res = await router.handle({ request: { id: 'r1', method: 'nope', params: {} }, ctx: {} })
    expect(res.id).toBe('r1')
    expect(res.error?.code).toBe(404)
  })

  test('known method runs and returns result', async () => {
    const router = createRouter()
    const proc = createProcedure()
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => ({ ok: true, id: input.id }))
    router.add('user.get', proc)

    const res = await router.handle({ request: { id: 'r2', method: 'user.get', params: { id: 7 } }, ctx: {} })
    expect(res.id).toBe('r2')
    expect(res.result).toEqual({ ok: true, id: 7 })
  })
})


