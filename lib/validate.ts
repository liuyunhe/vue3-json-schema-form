import { Schema, ErrorSchema } from './types'
import i18n from 'ajv-i18n'
import Ajv, { ErrorObject } from 'ajv'
import { toPath } from 'lodash'
import { isObject } from './utils'

interface TransformErrorsObject {
  name: string
  property: string
  message: string | undefined
  params: Record<string, any>
  schemaPath: string
}

function toErrorSchema(errors: TransformErrorsObject[]) {
  if (errors.length < 1) return {}

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = toPath(property)
    let parent = errorSchema

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }

    // /obj/a
    // {
    //   obj: {
    //     a: {
    //     }
    //   }
    // }
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }
    return errorSchema
  }, {} as ErrorSchema)
}

function transformErrors(
  errors: ErrorObject[] | null | undefined
): TransformErrorsObject[] {
  if (errors === null || errors === undefined) return []
  return errors.map(
    ({ message, instancePath, keyword, params, schemaPath }) => {
      return {
        name: keyword,
        property: `${instancePath}`,
        message,
        params,
        schemaPath
      }
    }
  )
}

interface validateFormDataObject {
  errors: TransformErrorsObject[]
  errorSchema: Record<string, unknown>
  valid: boolean
}

export function validateFormData(
  validator: Ajv,
  formData: unknown,
  shema: Schema,
  locale = 'zh',
  customValidate?: (data: any, errors: any) => void
): validateFormDataObject {
  let validatorError = null
  try {
    validator.validate(shema, formData)
  } catch (err) {
    validatorError = err
  }
  i18n[locale as 'zh'](validator.errors as unknown as ErrorObject)
  let errors = transformErrors(validator.errors)

  if (validatorError) {
    errors = [
      ...errors,
      {
        message: validatorError.message
      } as TransformErrorsObject
    ]
  }

  const errorSchema = toErrorSchema(errors)

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0
    }
  }
  const proxy = createErrorProxy()
  customValidate(formData, proxy)
  const newErrorSchema = mergeObjects(errorSchema, proxy, true)
  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0
  }
}

function createErrorProxy() {
  const raw = {}
  return new Proxy(raw, {
    get(target, key, reciver) {
      if (key === 'addError') {
        return (msg: string) => {
          const __errors = Reflect.get(target, '__errors', reciver)
          if (__errors && Array.isArray(__errors)) {
            __errors.push(msg)
          } else {
            ;(target as any).__errors = [msg]
          }
        }
      }
      const res = Reflect.get(target, key, reciver)
      if (res === undefined) {
        console.log(key)
        const p: any = createErrorProxy()
        ;(target as any)[key] = p
        return p
      }
      return res
    }
  })
}

// eslint-disable-next-line
export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (
      obj1 &&
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      isObject(right)
    ) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}
