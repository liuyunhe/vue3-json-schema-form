import { defineComponent, PropType } from 'vue'
import {
  FieldPropsDefine,
  Schema,
  SelectionWidgetNames,
  UISchema
} from '../types'
import { useVJSFContext } from '../context'
// import SelectionWidget from '../widgets/Selection'
import { createUseStyles } from 'vue-jss'
import { getWidget } from '../theme'

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee'
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right'
  },
  action: {
    '& + &': {
      marginLeft: 10
    }
  },
  content: {
    padding: 10
  }
})

const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props, { slots }) {
    const classesRef = useStyles()
    const handleAdd = () => props.onAdd(props.index)
    const handleDelete = () => props.onDelete(props.index)
    const handleUp = () => props.onUp(props.index)
    const handleDown = () => props.onDown(props.index)
    return () => {
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  }
})

/**
 * {
 *   items: { type: string }
 * }
 *
 * {
 *   items: [
 *    { type: string },
 *    { type: number },
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum:['1', '2'] }
 * }
 */

export default defineComponent({
  name: 'ArrayField',
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    const SelectionWidgetRef = getWidget(SelectionWidgetNames.SelectionWidget)

    const handleMultiTypeChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr[index] = v
      props.onChange(arr)
    }
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr[index] = v
      props.onChange(arr)
    }

    const handleAdd = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr.splice(index + 1, 0, undefined)
      props.onChange(arr)
    }

    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr.splice(index, 1)
      props.onChange(arr)
    }

    const handleUp = (index: number) => {
      if (index === 0) return
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      const item = arr.splice(index, 1)
      arr.splice(index - 1, 0, item[0])
      props.onChange(arr)
    }

    const handleDowm = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      if (index === arr.length - 1) return
      const item = arr.splice(index, 1)
      arr.splice(index + 1, 0, item[0])
      props.onChange(arr)
    }

    return () => {
      const { schema, value, rootSchema, errorSchema, uiSchema } = props
      const SelectionWidget = SelectionWidgetRef.value
      const SchemaItem = context.SchemaItem
      // const SelectionWidget = context.theme.widgets.SelectionWidget
      const isMultiType = Array.isArray(schema?.items)
      const isSelect = schema?.items && (schema.items as any).enum

      if (isMultiType) {
        const items: Schema[] = schema?.items as any
        const arr = Array.isArray(value) ? value : []
        return items.map((schema: Schema, index: number) => {
          const itemsUiSchema = uiSchema.items
          const us = Array.isArray(itemsUiSchema)
            ? itemsUiSchema[index] || {}
            : itemsUiSchema || {}
          return (
            <SchemaItem
              schema={schema}
              key={index}
              value={arr[index]}
              rootSchema={rootSchema}
              errorSchema={errorSchema[index] || {}}
              onChange={(v: any) => handleMultiTypeChange(v, index)}
              uiSchema={us}
            />
          )
        })
      } else if (!isSelect) {
        const arr = Array.isArray(value) ? value : []
        return arr.map((v: any, index: number) => (
          <ArrayItemWrapper
            index={index}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUp={handleUp}
            onDown={handleDowm}
          >
            <SchemaItem
              schema={schema?.items as Schema}
              key={index}
              value={v}
              rootSchema={rootSchema}
              errorSchema={errorSchema[index] || {}}
              onChange={(v: any) => handleArrayItemChange(v, index)}
              uiSchema={(uiSchema.items as UISchema) || {}}
            />
          </ArrayItemWrapper>
        ))
      } else {
        const enumOptions = (schema as any).items.enum
        const options = enumOptions.map((e: any) => ({
          key: e,
          value: e
        }))
        return (
          <SelectionWidget
            onChange={props.onChange}
            value={props.value}
            options={options}
            errors={errorSchema.__errors}
            schema={schema as Schema}
          />
        )
      }
    }
  }
})
