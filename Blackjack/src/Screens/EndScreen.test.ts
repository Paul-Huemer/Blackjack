import { describe, test, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import EndScreen from './EndScreen.vue'

const wrapper = shallowMount(EndScreen)

describe('EndScreen button render', () => {
    test('should render the button text', () => {
        expect(wrapper.get('button').text()).equals('Return to Menu')
    })
})

describe('EndScreen emits', () => {
    test('should emit return', async () => {
        const button = wrapper.get('button');
        await button.trigger('click');
        expect(wrapper.emitted('return'));
    })
})