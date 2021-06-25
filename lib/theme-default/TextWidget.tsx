import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { defineComponent } from 'vue'

const TextWidget: CommonWidgetDefine = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: Event): void => {
      const value = (e.target as HTMLInputElement).value
      const currentTarget = e.target as HTMLInputElement
      currentTarget.value = props.value as string
      props.onChange(value)
    }
    return () => (
      <input type="text" value={props.value as any} onInput={handleChange} />
    )
  }
})

export default TextWidget
