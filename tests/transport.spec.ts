import { RPCSerializer } from '../src/core/serializer'
import { RPCTransport } from '../src/core/transport'
import { RPCRequest, RPCResponse } from '../src/types/rpc'

function startServer(handler: (req: RPCRequest) => Promise<RPCResponse>) {
  return RPCTransport.createServer(handler)
}

describe('RPCTransport', () => {
  const PORT = 3101
  const URL = `http://localhost:${PORT}`

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('echo handler round-trips over HTTP', async () => {
    const handler = async (request: RPCRequest): Promise<RPCResponse> => {
      return RPCSerializer.createResponse(request.id, {
        method: request.method,
        echo: request.params
      })
    }

    const server = startServer(handler)
    await new Promise<void>((resolve) => server.listen(PORT, resolve))

    const req = RPCSerializer.createRequest('t-1', 'sayHello', { name: 'RPC' })
    const res = await RPCTransport.sendRequest(URL, req)
    expect(res.id).toBe('t-1')
    expect(res.result).toEqual({ method: 'sayHello', echo: { name: 'RPC' } })

    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  test('non-POST returns 405 with JSON error', async () => {
    const handler = async (request: RPCRequest): Promise<RPCResponse> => {
      return RPCSerializer.createResponse(request.id, { ok: true })
    }

    const server = startServer(handler)
    await new Promise<void>((resolve) => server.listen(PORT, resolve))

    const http = await import('http')
    const resBody: string = await new Promise((resolve) => {
      const req = http.request({ hostname: 'localhost', port: PORT, path: '/', method: 'GET' }, (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => resolve(data))
      })
      req.end()
    })
    const parsed = JSON.parse(resBody)
    expect(parsed.error).toBeDefined()

    await new Promise<void>((resolve) => server.close(() => resolve()))
  })

  test('handler throw returns 500 error envelope', async () => {
    const handler = async (): Promise<RPCResponse> => {
      throw new Error('boom')
    }

    const server = startServer(handler)
    await new Promise<void>((resolve) => server.listen(PORT, resolve))

    const req = RPCSerializer.createRequest('t-2', 'explode', {})
    const res = await RPCTransport.sendRequest(URL, req)
    expect(res.id).toBe('unknown')
    expect(res.error?.code).toBe(500)

    await new Promise<void>((resolve) => server.close(() => resolve()))
  })
})


