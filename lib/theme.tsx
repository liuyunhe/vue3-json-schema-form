import {
  computed,
  ComputedRef,
  defineComponent,
  inject,
  PropType,
  provide
} from 'vue'
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetNames,
  UISchema,
  CommonWidgetDefine
} from './types'
import { isObject } from './utils'

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
  uiSchema?: UISchema
) {
  if (uiSchema?.widget && isObject(uiSchema.widget)) {
    return uiSchema.widget as CommonWidgetDefine
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
