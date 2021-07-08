import { CustomKeyword } from '../../lib/types'

const keyword: CustomKeyword = {
  name: 'test',
  definition: {
    macro: () => {
      return {
        minLength: 10
      }
    }
  },
  transFormSchema(schema) {
    return {
      ...schema,
      minLength: 10
    }
  }
}

export default keyword
