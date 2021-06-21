import { defineComponent } from 'vue'
import { FieldPropsDefine, Schema } from '../types'
import { useVJSFContext } from '../context'

/**
 * {
 *   items: { type: string }
 * }
 *
 * {
 *   items: [
 *    { type: string },
 *    { type: number },
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum:['1', '2'] }
 * }
 */

export default defineComponent({
  name: 'Array Field',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleMultiTypeChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr[index] = v
      props.onChange(arr)
    }

    return () => {
      const { schema, value, rootSchema } = props

      const SchemaItem = context.SchemaItem

      const isMultiType = Array.isArray(schema?.items)

      if (isMultiType) {
        const items: Schema[] = schema?.items as any
        const arr = Array.isArray(value) ? value : []
        return items.map((schema: Schema, index: number) => (
          <SchemaItem
            schema={schema}
            key={index}
            value={arr[index]}
            rootSchema={rootSchema}
            onChange={(v: any) => handleMultiTypeChange(v, index)}
          />
        ))
      }

      return <div>hehe</div>
    }
  }
})
