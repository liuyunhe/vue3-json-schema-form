import { defineComponent, PropType } from 'vue'
import { Schema, SchemaTypes } from './types'
import NumberField from './fields/NumberField'
import StringField from './fields/StringField'

export default defineComponent({
  name: 'SchemaItem',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      requried: true
    },
    value: {
      required: true
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true
    }
  },
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
