import { mount } from '@vue/test-utils'

import {
  NumberField,
  StringField,
  ArrayField,
  SelectionWidget
} from '../../lib'

import TestComponent from './utils/TestComponent'

describe('ArrayField', () => {
  it('should render multi type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        value: [],
        onChange: () => {
          console.log('render multi type')
        }
      }
    })

    const arrField = wrapper.findComponent(ArrayField)
    const strField = arrField.findComponent(StringField)
    const numField = arrField.findComponent(NumberField)

    expect(strField.exists()).toBeTruthy()
    expect(numField.exists()).toBeTruthy()
  })

  it('should render single type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: { type: 'string' }
        },
        value: ['1', '2'],
        onChange: () => {
          console.log('render single type')
        }
      }
    })

    const arrField = wrapper.findComponent(ArrayField)
    const strField = arrField.findAllComponents(StringField)

    expect(strField.length).toBe(2)
    expect(strField[0].props('value')).toBe('1')
  })

  it('should render select type', () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['1', '2', '3']
          }
        },
        value: [],
        onChange: () => {
          console.log('render select type')
        }
      }
    })

    const arrField = wrapper.findComponent(ArrayField)
    const selectWidget = arrField.findComponent(SelectionWidget)

    expect(selectWidget.exists()).toBeTruthy()
  })
})
