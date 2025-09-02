import { RPCSerializer } from '../src/core/serializer'
import { RPCRequest, RPCResponse } from '../src/types/rpc'

describe('RPCSerializer', () => {
  test('serializes a valid RPCRequest to JSON string', () => {
    const request: RPCRequest = { id: 'req-1', method: 'getUser', params: { id: 42 } }
    const serialized = RPCSerializer.serialize(request)
    expect(typeof serialized).toBe('string')
    const parsed = JSON.parse(serialized)
    expect(parsed).toEqual(request)
  })

  test('deserializes a valid JSON string back to RPCRequest', () => {
    const request: RPCRequest = { id: 'req-2', method: 'sayHello', params: { name: 'Ada' } }
    const json = JSON.stringify(request)
    const deserialized = RPCSerializer.deserialize<RPCRequest>(json)
    expect(deserialized).toEqual(request)
  })

  test('throws on deserializing message without id', () => {
    const badJson = JSON.stringify({ method: 'x', params: {} })
    expect(() => RPCSerializer.deserialize<RPCRequest>(badJson)).toThrow('Invalid RPC message: missing id')
  })

  test('createResponse returns only result', () => {
    const res = RPCSerializer.createResponse('req-3', { ok: true })
    expect(res.id).toBe('req-3')
    expect('result' in res).toBe(true)
    expect((res as RPCResponse).error).toBeUndefined()
  })

  test('createErrorResponse returns only error', () => {
    const res = RPCSerializer.createErrorResponse('req-4', 400, 'Bad input')
    expect(res.id).toBe('req-4')
    expect(res.error).toEqual({ code: 400, message: 'Bad input', data: undefined })
    expect((res as RPCResponse).result).toBeUndefined()
  })

  test('round-trips a request through serialize/deserialize', () => {
    const original = RPCSerializer.createRequest('req-5', 'echo', { value: { nested: [1, 2, 3] } })
    const wire = RPCSerializer.serialize(original)
    const restored = RPCSerializer.deserialize<RPCRequest>(wire)
    expect(restored).toEqual(original)
  })
})


