import {
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
import { FieldPropsDefine, Schema, ErrorSchema } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'
import { validateFormData } from './validate'

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    valid: boolean
  }>
}

const defaultAjvOptions: Options = {
  allErrors: true
}

export default defineComponent({
  name: 'SchemaForm',
  props: {
    ...FieldPropsDefine,
    errorSchema: {
      type: Object as PropType<ErrorSchema>
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>
    },
    ajvOptions: {
      type: Object as PropType<Options>
    },
    locale: {
      type: String,
      default: 'zh'
    },
    customValidate: {
      type: Function as PropType<(data: any, errors: any) => void>
    }
  },
  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const context: any = {
      SchemaItem
    }
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validatorRef: Ref<Ajv> = shallowRef() as any
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions
      })
    })

    const validateResolveRef = ref()
    const validateIndex = ref(0)

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate()
        }
      },
      { deep: true }
    )

    async function doValidate() {
      console.log('start validate ------')
      const index = (validateIndex.value += 1)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema as Schema,
        props.locale,
        props.customValidate
      )
      if (index !== validateIndex.value) return
      console.log('end validate ------')
      errorSchemaRef.value = result.errorSchema as ErrorSchema
      validateResolveRef.value(result)
      validateResolveRef.value = undefined
    }

    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              console.log('-----')
              return new Promise((resolve) => {
                validateResolveRef.value = resolve
                doValidate()
              })
            }
          }
        }
      },
      {
        immediate: true
      }
    )
    provide(SchemaFormContextKey, context)
    return () => {
      const { schema, value } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          errorSchema={errorSchemaRef.value}
        />
      )
    }
  }
})
