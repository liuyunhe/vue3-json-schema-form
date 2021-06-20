import { defineComponent } from 'vue'
import { SchemaTypes, FieldPropsDefine } from './types'
import NumberField from './fields/NumberField.vue'
import StringField from './fields/StringField.vue'

export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  setup(props) {
    return () => {
      const schema = props.schema

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
        default: {
          console.log(`${type} is not supported`)
        }
      }

      return <Component {...props} />
    }
  }
})
