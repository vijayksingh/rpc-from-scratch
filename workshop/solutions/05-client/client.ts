import { ZodTypeAny, z } from 'zod'
import { RPCSerializer } from '../../../src/core/serializer'
import { RPCTransport } from '../../../src/core/transport'

export type ClientDefinitions = Record<string, { input: ZodTypeAny }>

function generateId() {
  return Math.random().toString(36).slice(2)
}

export function createClient(args: { url: string; procedures: ClientDefinitions }) {
  const { url, procedures } = args
  const client: Record<string, any> = {}

  for (const [method, def] of Object.entries(procedures)) {
    type Input = z.infer<typeof def.input>
    client[method] = async (input: Input) => {
      const validated = (def.input as any).parse(input) as Input
      const req = RPCSerializer.createRequest(generateId(), method, validated)
      const res = await RPCTransport.sendRequest(url, req)
      if (res.error) {
        throw new Error(res.error.message)
      }
      return res.result
    }
  }

  return client
}


