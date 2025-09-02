import { RPCRequest, RPCResponse } from '../../../src/types/rpc'

export class RPCSerializerSolution {
  static serialize(data: RPCRequest | RPCResponse): string {
    try {
      return JSON.stringify(data)
    } catch (error) {
      throw new Error(`Serialization failed: ${error}`)
    }
  }

  static deserialize<T = RPCRequest | RPCResponse>(data: string): T {
    try {
      const parsed = JSON.parse(data)
      if (!parsed.id) {
        throw new Error('Invalid RPC message: missing id')
      }
      return parsed as T
    } catch (error) {
      throw new Error(`Deserialization failed: ${error}`)
    }
  }

  static createRequest(id: string, method: string, params: any): RPCRequest {
    return { id, method, params }
  }

  static createResponse(id: string, result: any): RPCResponse {
    return { id, result }
  }

  static createErrorResponse(id: string, code: number, message: string, data?: any): RPCResponse {
    return { id, error: { code, message, data } }
  }
}


