import PasswordWidget from '../components/PasswordWidget'

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        minLength: 10,
        title: 'password'
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 'retry password'
      },
      color: {
        type: 'string',
        format: 'color',
        title: 'input color'
      }
    }
  },
  // eslint-disable-next-line
  async customValidate(data: any, errors: any) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('密码必须相同！')
        }
        resolve()
      }, 2000)
    })
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget
      },
      pass2: {
        options: {
          color: 'red'
        }
      }
    }
  },
  default: 1
}
