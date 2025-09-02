// TODO: Implement in Lesson 02
// This scaffold intentionally lacks implementation to support TDD.
// Tests should fail until you complete the methods below.

import * as http from 'http'
import { RPCRequest, RPCResponse } from '../types/rpc'

export class RPCTransport {
  static createServer(_onRequest: (request: RPCRequest) => Promise<RPCResponse>): http.Server {
    throw new Error('Not implemented')
  }

  static async sendRequest(_url: string, _request: RPCRequest): Promise<RPCResponse> {
    throw new Error('Not implemented')
  }
}