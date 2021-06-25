import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
import { defineComponent } from 'vue'

const NumberWidget: CommonWidgetDefine = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: Event): void => {
      const value = (e.target as HTMLInputElement).value
      const currentTarget = e.target as HTMLInputElement
      currentTarget.value = props.value as string
      props.onChange(value)
      console.log(111)
    }
    return () => (
      <input type="number" value={props.value as any} onInput={handleChange} />
    )
  }
})

export default NumberWidget
