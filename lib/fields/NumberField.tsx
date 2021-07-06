import { FieldPropsDefine, CommonWidgetNames } from '../../lib/types'
import { defineComponent, computed } from 'vue'
import { getWidget } from '../theme'
import { Schema } from '../types'

export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string): void => {
      const num = Number(v)
      if (Number.isNaN(num)) {
        props.onChange(undefined)
      } else {
        props.onChange(num)
      }
    }
    const NumberWidgetRef = computed(() => {
      const widgetRef = getWidget(
        CommonWidgetNames.NumberWidget,
        props.uiSchema
      )
      return widgetRef.value
    })
    return () => {
      const NumberWidget = NumberWidgetRef.value
      const { value, errorSchema, schema } = props
      return (
        <NumberWidget
          value={value}
          errors={errorSchema.__errors}
          onChange={handleChange}
          schema={schema as Schema}
        />
      )
    }
  }
})
