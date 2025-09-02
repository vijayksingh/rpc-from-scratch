import { RPCSerializer } from '../core/serializer'

// Test our serialization
console.log('🧪 Testing RPC Serialization...\n')

// 1. Create a request
const request = RPCSerializer.createRequest('req-123', 'getUser', { id: 42 })
console.log('📤 Request object:', request)

// 2. Serialize it (this is what goes over the network)
const serialized = RPCSerializer.serialize(request)
console.log('📡 Serialized:', serialized)

// 3. Deserialize it (this is what the server receives)
const deserialized = RPCSerializer.deserialize(serialized)
console.log('📥 Deserialized:', deserialized)

// 4. Test response creation
const response = RPCSerializer.createResponse('req-123', { id: 42, name: 'John' })
console.log('\n📤 Response object:', response)

// 5. Test error response
const errorResponse = RPCSerializer.createErrorResponse('req-123', 404, 'User not found')
console.log('❌ Error response:', errorResponse)