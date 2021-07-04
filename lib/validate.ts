import { Schema, ErrorSchema } from './types'
import i18n from 'ajv-i18n'
import Ajv, { ErrorObject } from 'ajv'
import { toPath } from 'lodash'

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
  locale = 'zh'
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

  return {
    errors,
    errorSchema,
    valid: errors.length === 0
  }
}
