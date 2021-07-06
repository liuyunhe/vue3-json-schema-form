import { inject, Ref } from 'vue'
import { CommonFieldDefine, CommonWidgetDefine } from './types'

export const SchemaFormContextKey = Symbol()

// eslint-disable-next-line
export function useVJSFContext() {
  const context:
    | {
        SchemaItem: CommonFieldDefine
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>
      }
    | undefined = inject(SchemaFormContextKey)

  if (!context) {
    throw Error('SchemaForm should be used')
  }

  return context
}
