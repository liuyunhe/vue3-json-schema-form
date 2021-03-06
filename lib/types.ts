import { PropType, defineComponent, DefineComponent } from 'vue'
import { FormatDefinition } from 'ajv'
import { MacroKeywordFunc } from 'ajv/dist/types'

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
  widget?:
    | 'checkbox'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'range'
    | string
    | CommonWidgetDefine
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
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true
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

export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true
  },
  errors: {
    type: Array as PropType<string[]>
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true
  },
  options: {
    type: Object as PropType<{ [key: string]: any }>
  }
} as const

export const SelectionWidgetPropsDefine = {
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
} as const

export type CommonWidgetDefine = DefineComponent<typeof CommonWidgetPropsDefine>
export type SelectionWidgetDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine
>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget'
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget'
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}

// fix error TS2456: Type alias 'ErrorSchema' circularly references itself
interface ErrorSchemaObject {
  [level: string]: ErrorSchema
}

export type ErrorSchema = ErrorSchemaObject & {
  __errors?: string[]
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition<string | number>
  component: CommonWidgetDefine
}

interface VjsKeywordDefinition {
  type?: string | Array<string>
  async?: boolean
  $data?: boolean
  errors?: boolean | string
  metaSchema?: Record<string, unknown>

  schema?: boolean
  statements?: boolean
  dependencies?: string[]
  modifying?: boolean
  valid?: boolean

  macro: MacroKeywordFunc
}
export interface CustomKeyword {
  name: string
  definition: VjsKeywordDefinition
  transFormSchema: (originSchema: Schema) => Schema
}
