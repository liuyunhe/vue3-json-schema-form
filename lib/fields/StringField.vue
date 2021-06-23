<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FieldPropsDefine } from '../types'

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: Event): void => {
      const currentTarget = e.target as HTMLInputElement
      props.onChange(currentTarget.value)
    }
    return {
      handleChange
    }
  }
})
</script>
