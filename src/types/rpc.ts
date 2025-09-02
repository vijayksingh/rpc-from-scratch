// Core RPC message types

// Every RPC call needs a unique ID to match requests with responses
export interface RPCRequest {
  id: string
  method: string  // procedure name like "getUser" or "createPost"
  params: any     // the input data
}

export interface RPCResponse {
  id: string      // matches the request ID
  result?: any    // success response data
  error?: {       // error details if something went wrong
    code: number
    message: string
    data?: any
  }
}

// Different types of RPC procedures
export type ProcedureType = 'query' | 'mutation'

// Context passed to every procedure (user info, request data, etc.)
export interface RPCContext {
  // We'll expand this as we build more features
  [key: string]: any
}