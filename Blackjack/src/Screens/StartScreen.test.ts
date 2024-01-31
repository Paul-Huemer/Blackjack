import { describe, test, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import StartScreen from './StartScreen.vue'

const wrapper = shallowMount(StartScreen)

describe('StartScreen button render', () => {
    test('should render the button text', () => {
        expect(wrapper.get('button').text()).equals('Play!')
    })
})

describe('StartScreen emits', () => {
    test('should emit playButtonPressed', async () => {
        const button = wrapper.get('button');
        await button.trigger('click');
        expect(wrapper.emitted('playButtonPressed'));
    })
})