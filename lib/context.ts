import { inject } from 'vue'
import { CommonFieldDefine } from './types'

export const SchemaFormContextKey = Symbol()

// eslint-disable-next-line
export function useVJSFContext() {
  const context: { SchemaItem: CommonFieldDefine } | undefined =
    inject(SchemaFormContextKey)

  if (!context) {
    throw Error('SchemaForm should be used')
  }

  return context
}
