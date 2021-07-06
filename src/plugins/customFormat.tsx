import { defineComponent, computed } from 'vue'
import { CustomFormat, CommonWidgetPropsDefine } from '../../lib/types'
import { withFormItem } from '../../lib/theme-default/FormItem'

const format: CustomFormat = {
  name: 'color',
  definition: {
    type: 'string',
    validate: /^#[0-9A-fa-f]{6}$/
  },
  component: withFormItem(
    defineComponent({
      name: 'ColorWidget',
      props: CommonWidgetPropsDefine,
      setup(props) {
        const handleChange = (e: Event): void => {
          const value = (e.target as HTMLInputElement).value
          const currentTarget = e.target as HTMLInputElement
          currentTarget.value = props.value as string
          props.onChange(value)
        }

        const styleRef = computed(() => {
          return {
            color: (props.options && props.options.color) || 'black'
          }
        })

        return () => (
          <input
            type="color"
            value={props.value as any}
            onInput={handleChange}
            style={styleRef.value}
          />
        )
      }
    })
  )
}

export default format
