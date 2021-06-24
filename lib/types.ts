import { PropType, defineComponent, DefineComponent } from 'vue'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean'
}

export interface VueJsonSchemaConfig {
  title?: string
  descrription?: string
  component?: string
  options?: {
    [key: string]: any
  }
  withFormItem?: boolean
  widget?: 'checkbox' | 'textarea' | 'select' | 'radio' | 'range' | string
  items?: UISchema | UISchema[]
  propertiesOrder?: string[]
  controls?: {
    sortable?: boolean
    removeable?: boolean
    addable?: boolean
  }
}

type SchemaRef = { $ref: string }

export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  // TODO: uiSchema
  // vjsg?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FieldPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    requried: true
  },
  value: {
    required: true
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    requried: true
  }
} as const

export interface UISchema extends VueJsonSchemaConfig {
  properties?: {
    [property: string]: UISchema
  }
}

const TypeHelperComponent = defineComponent({
  props: FieldPropsDefine
})

export type CommonFieldDefine = typeof TypeHelperComponent

const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true
  }
} as const

const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true
  }
}

type CommonWidgetDefine = DefineComponent<typeof CommonWidgetPropsDefine>
type SelectionWidgetDefine = DefineComponent<typeof SelectionWidgetPropsDefine>

export interface Theme {
  widgets: {
    SelectionWidget: SelectionWidgetDefine
    TextWidget: CommonWidgetDefine
    NumberWidget: CommonFieldDefine
  }
}
