import { FieldPropsDefine, CommonWidgetNames } from '../../lib/types'
import { defineComponent } from 'vue'
import { getWidget } from '../theme'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (v: string) => {
      props.onChange(v)
    }
    const TextWidgetRef = getWidget(CommonWidgetNames.TextWidget)
    return () => {
      const TextWidget = TextWidgetRef.value
      // eslint-disable-next-line
      const { value } = props
      return <TextWidget value={value} onChange={handleChange} />
    }
  }
})
