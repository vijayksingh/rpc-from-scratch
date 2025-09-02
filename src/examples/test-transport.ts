import { RPCTransport } from '../core/transport'
import { RPCSerializer } from '../core/serializer'
import { RPCRequest, RPCResponse } from '../types/rpc'

// Simple echo server that just returns what it receives
async function echoHandler(request: RPCRequest): Promise<RPCResponse> {
  console.log(`🔄 Processing: ${request.method} with params:`, request.params)
  
  // Simple echo - just return the params as the result
  return RPCSerializer.createResponse(request.id, {
    echo: request.params,
    method: request.method,
    timestamp: new Date().toISOString()
  })
}

// Test the transport layer
async function testTransport() {
  console.log('🚀 Starting RPC transport test...\n')
  
  // Start the server
  const server = RPCTransport.createServer(echoHandler)
  const PORT = 3000
  
  server.listen(PORT, () => {
    console.log(`🌐 RPC Server running on http://localhost:${PORT}`)
    
    // Test client call after server starts
    setTimeout(testClient, 500)
  })
}

async function testClient() {
  try {
    console.log('\n📞 Testing client calls...')
    
    // Create a test request
    const request = RPCSerializer.createRequest('test-123', 'sayHello', { name: 'World' })
    
    // Send it via transport
    const response = await RPCTransport.sendRequest('http://localhost:3000', request)
    
    console.log('✅ Success! Response:', response)
    
    // Test error case too
    console.log('\n🧪 Testing with different method...')
    const request2 = RPCSerializer.createRequest('test-456', 'getUser', { id: 42 })
    const response2 = await RPCTransport.sendRequest('http://localhost:3000', request2)
    
    console.log('✅ Success! Response:', response2)
    
    // Shutdown
    setTimeout(() => process.exit(0), 1000)
    
  } catch (error) {
    console.error('❌ Client error:', error)
    process.exit(1)
  }
}

testTransport()