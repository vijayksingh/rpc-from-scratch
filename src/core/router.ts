// TODO: Implement in Lesson 04
// This scaffold intentionally lacks implementation to support TDD.
// Tests should fail until you complete the functions below.

import { RPCRequest, RPCResponse } from '../types/rpc';

export interface ProcedureLike {
  call(args: { input: any; ctx: any }): Promise<any>
}

export function createRouter() {
  return {
    add(_name: string, _procedure: ProcedureLike) {
      throw new Error('Not implemented')
    },
    async handle(_args: { request: RPCRequest; ctx: any }): Promise<RPCResponse> {
      throw new Error('Not implemented')
    }
  }
}


