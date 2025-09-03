import { ProcedureLike } from '../../../src/core/router'
import { RPCSerializer } from '../../../src/core/serializer'
import { RPCRequest, RPCResponse } from '../../../src/types/rpc'

export function createRouterSolution() {
  const table = new Map<string, ProcedureLike>()
  return {
    add(name: string, procedure: ProcedureLike) {
      table.set(name, procedure)
      return this
    },
    async handle(args: { request: RPCRequest; ctx: any }): Promise<RPCResponse> {
      const { request, ctx } = args
      const proc = table.get(request.method)
      if (!proc) {
        return RPCSerializer.createErrorResponse(request.id, 404, `Unknown method: ${request.method}`)
      }
      try {
        const result = await proc.call({ input: request.params, ctx })
        return RPCSerializer.createResponse(request.id, result)
      } catch (_e: any) {
        return RPCSerializer.createErrorResponse(request.id, 500, 'Internal server error')
      }
    }
  }
}


