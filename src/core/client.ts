// TODO: Implement in Lesson 05
// This scaffold intentionally lacks implementation to support TDD.
// Tests should fail until you complete the functions below.

import { ZodTypeAny } from 'zod';

export type ClientDefinitions = Record<string, { input: ZodTypeAny }>

export function createClient(_args: { url: string; procedures: ClientDefinitions }) {
  throw new Error('Not implemented')
}


