import { z } from 'zod'
import { createClient } from '../src/core/client'
import { RPCSerializer } from '../src/core/serializer'
import { RPCTransport } from '../src/core/transport'

jest.mock('../src/core/transport', () => ({
  RPCTransport: {
    sendRequest: jest.fn()
  }
}))

describe('Client proxy', () => {
  test('calls transport and returns unwrapped result', async () => {
    const client = createClient({
      url: 'http://example.com',
      procedures: {
        'user.get': { input: z.object({ id: z.number() }) }
      }
    }) as any

      ; (RPCTransport.sendRequest as jest.Mock).mockResolvedValueOnce(
        RPCSerializer.createResponse('x', { ok: true, id: 1 })
      )

    const res = await client['user.get']({ id: 1 })
    expect(res).toEqual({ ok: true, id: 1 })
  })

  test('throws on error envelope', async () => {
    const client = createClient({
      url: 'http://example.com',
      procedures: {
        'user.get': { input: z.object({ id: z.number() }) }
      }
    }) as any

      ; (RPCTransport.sendRequest as jest.Mock).mockResolvedValueOnce(
        RPCSerializer.createErrorResponse('x', 404, 'not found')
      )

    await expect(client['user.get']({ id: 2 })).rejects.toThrow('not found')
  })
})


