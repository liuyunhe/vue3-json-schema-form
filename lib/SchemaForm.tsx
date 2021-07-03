import { defineComponent, provide } from 'vue'
import { FieldPropsDefine } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
interface ContextRef {
  doValidate: () => {
    errors: any[]
    valid: boolean
  }
}

export default defineComponent({
  name: 'SchemaForm',
  props: {
    ...FieldPropsDefine,
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>
    },
    ajvOptions: {
      type: Object as PropType<Options>
    }
  },
  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }
    const context: any = {
      SchemaItem
    }
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              console.log('-----')
              const valid = validatorRef.value.validate(
                props.schema as Schema,
                props.value
              )
              return {
                valid: valid,
                errors: validatorRef.value.errors || []
              }
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
        />
      )
    }
  }
})
