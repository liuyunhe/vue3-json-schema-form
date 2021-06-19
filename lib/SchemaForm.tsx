import { defineComponent, PropType } from 'vue'
import { Schema, SchemaTypes } from './types'

export default defineComponent({
  name: 'SchemaForm',
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
      const type = schema?.type
      switch (type) {
        case SchemaTypes.STRING: {
          return <input type="text" />
        }
        case SchemaTypes.OBJECT: {
          return <input type="text" />
        }
      }
      return <div>this is SchemaForm</div>
    }
  }
})
