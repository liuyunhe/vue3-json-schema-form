const Ajv = require('ajv')
const localize = require('ajv-i18n')

const schema = {
  type: 'string',
  minLength: 10,
  errorMessage: {
    type: '必须是字符串',
    minLength: '长度必须大于10'
  }
}

const ajv = new Ajv({ allErrors: true })
require('ajv-errors')(ajv)
const validate = ajv.compile(schema)
const valid = validate(11111)
if (!valid) {
  // localize.zh(validate.errors)
  console.log(validate.errors)
}
