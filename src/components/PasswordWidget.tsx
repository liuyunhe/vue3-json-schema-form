import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../../lib/types'
import { defineComponent } from 'vue'
import { withFormItem } from '../../lib/theme-default/FormItem'

const PasswordWidget: CommonWidgetDefine = withFormItem(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: Event): void => {
        const value = (e.target as HTMLInputElement).value
        const currentTarget = e.target as HTMLInputElement
        currentTarget.value = props.value as string
        props.onChange(value)
      }
      return () => (
        <input
          type="password"
          value={props.value as any}
          onInput={handleChange}
        />
      )
    }
  })
)

export default PasswordWidget
