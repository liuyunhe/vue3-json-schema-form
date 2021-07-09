import {
  computed,
  defineComponent,
  PropType,
  provide,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect
} from 'vue'
import {
  FieldPropsDefine,
  Schema,
  ErrorSchema,
  UISchema,
  CustomFormat,
  CommonWidgetDefine,
  CustomKeyword
} from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
import Ajv, { KeywordDefinition, Options } from 'ajv'
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
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>
    },
    uiSchema: {
      type: Object as PropType<UISchema>
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>
    }
  },
  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validatorRef: Ref<Ajv> = shallowRef() as any
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions
      })
      // 自定义校验
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]

        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }
      // 自定义关键字
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(
            keyword.name,
            keyword.definition as KeywordDefinition
          )
        })
      }
    })

    const validateResolveRef = ref()
    const validateIndex = ref(0)

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidateResolve()
        }
      },
      { deep: true }
    )

    async function doValidateResolve() {
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
                doValidateResolve()
              })
            }
          }
        }
      },
      {
        immediate: true
      }
    )
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]

        return customFormats.reduce((result, format) => {
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetDefine })
      } else {
        return {}
      }
    })

    const transFormSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        return (schema: Schema) => {
          let newSchema = schema
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transFormSchema(schema)
            }
          })
          return newSchema
        }
      }
      return (schema: Schema) => schema
    })

    const context: any = {
      SchemaItem,
      formatMapRef,
      transFormSchemaRef
    }
    provide(SchemaFormContextKey, context)
    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          errorSchema={errorSchemaRef.value}
          uiSchema={uiSchema || {}}
        />
      )
    }
  }
})
