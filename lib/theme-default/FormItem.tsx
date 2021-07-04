import { defineComponent } from 'vue'
import { CommonWidgetPropsDefine } from '../types'

import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  // formItem: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   // alignItems: 'flex-start',
  //   '.vjsfDefaultThemeArrayItemContainer + &': {
  //     marginTop: 10
  //   }
  //   // '& + &': {
  //   //   marginTop: 10,
  //   // },
  // },
  // inputField: {},
  container: {},
  label: {
    // fontSize: theme.fontSize.label,
    // fontWeight: 900
    display: 'block',
    color: '#777'
  },
  // helper: {
  //   height: 30,
  //   fontSize: theme.fontSize.label,
  //   padding: 0,
  //   margin: 0,
  //   color: '#777'
  // },
  error: {
    height: 30,
    fontSize: 12,
    padding: 0,
    margin: 0,
    color: '#d50606'
  }
  // required: {
  //   color: '#d50606'
  // }
})

export default defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles()
    return () => {
      const { schema, errors } = props
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <label class={classes.label}>{schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.error}>
            {errors?.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </div>
      )
    }
  }
})
