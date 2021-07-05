import {
  defineComponent,
  PropType,
  provide,
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
  doValidate: () => {
    errors: any[]
    valid: boolean
  }
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
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              console.log('-----')
              // const valid = validatorRef.value.validate(
              //   props.schema as Schema,
              //   props.value
              // )
              const result = validateFormData(
                validatorRef.value,
                props.value,
                props.schema as Schema,
                props.locale,
                props.customValidate
              )

              errorSchemaRef.value = result.errorSchema as ErrorSchema

              return result
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
