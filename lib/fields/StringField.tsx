import { FieldPropsDefine, CommonWidgetNames, Schema } from '../../lib/types'
import { computed, defineComponent } from 'vue'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props.uiSchema)
      return widgetRef
    })
    const widgetOptionsRef = computed(() => {
      const { options } = props.uiSchema
      return options
    })
    return () => {
      const TextWidget = TextWidgetRef.value
      // eslint-disable-next-line
      const { value, errorSchema, schema } = props
      return (
        <TextWidget
          value={value}
          errors={errorSchema.__errors}
          onChange={handleChange}
          schema={schema as Schema}
          options={widgetOptionsRef.value}
        />
      )
    }
  }
})
