import { computed, defineComponent } from 'vue'
import { SchemaTypes, FieldPropsDefine } from './types'
import NumberField from './fields/NumberField'
import StringField from './fields/StringField'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'

import { retrieveSchema } from './utils'
import { useVJSFContext } from './context'

export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  setup(props) {
    const formContext = useVJSFContext()

    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return formContext.transFormSchemaRef.value(
        retrieveSchema(schema, rootSchema, value)
      )
    })
    return () => {
      const { schema } = props

      const retrievedSchema = retrievedSchemaRef.value

      //  TODO: 如果type没有指定，我们需要猜测type
      const type = schema?.type

      let Component: any

      switch (type) {
        case SchemaTypes.STRING: {
          Component = StringField
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField
          break
        }
        case SchemaTypes.OBJECT: {
          Component = ObjectField
          break
        }
        case SchemaTypes.ARRAY: {
          Component = ArrayField
          break
        }
        default: {
          console.log(`${type} is not supported`)
        }
      }

      return <Component {...props} schema={retrievedSchema} />
    }
  }
})
