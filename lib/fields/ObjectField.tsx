import { defineComponent } from 'vue'
import { FieldPropsDefine } from '../types'
import { isObject } from '../utils'
import { useVJSFContext } from '../context'

export default defineComponent({
  name: 'ObjectField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleObjectFieldChange = (key: string, v: any) => {
      const obj: any = isObject(props.value) ? props.value : {}
      if (v === undefined) {
        delete obj[key]
      } else {
        obj[key] = v
      }
      props.onChange(obj)
    }

    return () => {
      const { schema, rootSchema, value } = props

      const { SchemaItem } = context

      const properties = schema?.properties || {}

      const currentValue: any = isObject(value) ? value : {}

      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          key={index}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ))
    }
  }
})
