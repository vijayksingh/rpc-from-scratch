import * as http from 'http'
import { RPCSerializer } from '../../../src/core/serializer'
import { RPCRequest, RPCResponse } from '../../../src/types/rpc'

// Reference solution for Lesson 02
export class RPCTransportSolution {
  static createServer(onRequest: (request: RPCRequest) => Promise<RPCResponse>): http.Server {
    return http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Method not allowed' }))
        return
      }

      try {
        const body = await this.readBody(req)
        const rpcRequest = RPCSerializer.deserialize<RPCRequest>(body)
        const rpcResponse = await onRequest(rpcRequest)
        const responseBody = RPCSerializer.serialize(rpcResponse)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(responseBody)
      } catch (error) {
        const errorResponse = RPCSerializer.createErrorResponse('unknown', 500, 'Internal server error')
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(RPCSerializer.serialize(errorResponse))
      }
    })
  }

  static async sendRequest(url: string, request: RPCRequest): Promise<RPCResponse> {
    const body = RPCSerializer.serialize(request)

    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const options: http.RequestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 80,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }

      const req = http.request(options, (res) => {
        let responseBody = ''
        res.on('data', (chunk) => {
          responseBody += chunk
        })
        res.on('end', () => {
          try {
            const response = RPCSerializer.deserialize<RPCResponse>(responseBody)
            resolve(response)
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`))
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.write(body)
      req.end()
    })
  }

  private static readBody(req: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        resolve(body)
      })
      req.on('error', (error) => {
        reject(error)
      })
    })
  }
}


