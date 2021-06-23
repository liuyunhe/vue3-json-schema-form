import { FieldPropsDefine } from '../../lib/types'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: Event): void => {
      const currentTarget = e.target as HTMLInputElement
      props.onChange(currentTarget.value)
    }
    return () => {
      const { value } = props
      return <input type="text" value={value as any} onInput={handleChange} />
    }
  }
})
