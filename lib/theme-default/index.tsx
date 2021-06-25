import SelectionWidget from './SelectionWidget'
import TextWidget from './TextWidget'
import NumberWidget from './NumberWidget'

// import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../types'
// import { defineComponent } from 'vue'

// const CommonWidget: CommonWidgetDefine = defineComponent({
//   props: CommonWidgetPropsDefine,
//   setup() {
//     return () => null
//   }
// })

export default {
  widgets: {
    SelectionWidget,
    TextWidget,
    NumberWidget
  }
}
