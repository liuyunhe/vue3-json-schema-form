// provide and inject
import { inject, Ref } from 'vue'
import { CommonFieldDefine, CommonWidgetDefine, Schema } from './types'

// provide key
export const SchemaFormContextKey = Symbol()

// eslint-disable-next-line
export function useVJSFContext() {
  const context:
    | {
        SchemaItem: CommonFieldDefine
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>
        transFormSchemaRef: Ref<(schema: Schema) => Schema>
      }
    | undefined = inject(SchemaFormContextKey)

  if (!context) {
    throw Error('SchemaForm should be used')
  }

  return context
}
