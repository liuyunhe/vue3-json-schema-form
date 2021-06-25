import { defineComponent } from 'vue'
import JsonSchemaForm from '../../../lib'
import { FieldPropsDefine } from '../../../lib/types'
import defaultTheme from '../../../lib/theme-default'
import { ThemeProvider } from '../../../lib'

export const ThemeDefaultProvider = defineComponent({
  setup(p, { slots }) {
    return () => (
      <ThemeProvider theme={defaultTheme}>
        {slots.default && slots.default()}
      </ThemeProvider>
    )
  }
})

export default defineComponent({
  name: 'TestComponent',
  props: FieldPropsDefine,
  setup(props) {
    return () => (
      <ThemeDefaultProvider>
        <JsonSchemaForm {...props} />
      </ThemeDefaultProvider>
    )
  }
})
