// TODO: Implement in Lesson 01
// This scaffold intentionally lacks implementation to support TDD.
// Tests should fail until you complete the methods below.

import { RPCRequest, RPCResponse } from '../types/rpc'

export class RPCSerializer {
  static serialize(_data: RPCRequest | RPCResponse): string {
    throw new Error('Not implemented')
  }

  static deserialize<T = RPCRequest | RPCResponse>(_data: string): T {
    throw new Error('Not implemented')
  }

  static createRequest(_id: string, _method: string, _params: any): RPCRequest {
    throw new Error('Not implemented')
  }

  static createResponse(_id: string, _result: any): RPCResponse {
    throw new Error('Not implemented')
  }

  static createErrorResponse(_id: string, _code: number, _message: string, _data?: any): RPCResponse {
    throw new Error('Not implemented')
  }
}