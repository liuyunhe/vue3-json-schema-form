import {
  computed,
  ComputedRef,
  defineComponent,
  ExtractPropTypes,
  inject,
  PropType,
  provide
} from 'vue'
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetNames,
  FieldPropsDefine,
  CommonWidgetDefine
} from './types'
import { isObject } from './utils'
import { useVJSFContext } from './context'

const THEME_PROVIDER_KEY = Symbol()

const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true
    }
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme)

    provide(THEME_PROVIDER_KEY, context)

    return () => slots.default && slots.default()
  }
})

// eslint-disable-next-line
export function getWidget<T extends SelectionWidgetNames | CommonWidgetNames>(
  name: T,
  props: ExtractPropTypes<typeof FieldPropsDefine>
) {
  const formatContext = useVJSFContext()

  if (props) {
    const { uiSchema, schema } = props
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return uiSchema.widget as CommonWidgetDefine
    }
    if (schema?.format) {
      if (formatContext.formatMapRef.value[schema.format]) {
        return formatContext.formatMapRef.value[schema.format]
      }
    }
  }
  const context: ComputedRef<Theme> | undefined =
    inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY)
  if (!context) {
    throw new Error('vjsf theme required')
  }
  const widgetRef = computed(() => context.value.widgets[name])
  return widgetRef.value
}

export default ThemeProvider
