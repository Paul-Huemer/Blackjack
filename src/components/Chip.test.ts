import { describe, test, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import Chip from './Chip.vue'

const wrapper = shallowMount(Chip)

describe('Chip emits', () => {
    test('should emit chipClicked', async () => {
        const button = wrapper.get('img');
        await button.trigger('click');
        expect(wrapper.emitted('chipClicked'));
    })
})