import { describe, test, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import PlayScreen from './PlayScreen.vue'

const wrapper = shallowMount(PlayScreen)

describe('Playscreen button render', () => {
    test('should render the button text', () => {
        expect(wrapper.get('button').text()).equals('Finish')
    })
})

describe('Playscreen emits', () => {
    test('should emit playFinished', async () => {
        const button = wrapper.get('button');
        await button.trigger('click');
        expect(wrapper.emitted('playFinished'));
    })
})

describe('Playscreen Chips', () => {
    const chips = wrapper.findAll('.chip');
    test('Chips should be 5', async () => {
        expect(chips.length).equals(5);
    })
    test('Chips should be valued 5, 10, 20, 50, 100', async () => {
        let attributes = chips[0].attributes();
        expect(parseInt(attributes.chipvalue)).equals(5);
        attributes = chips[1].attributes();
        expect(parseInt(attributes.chipvalue)).equals(10);
        attributes = chips[2].attributes();
        expect(parseInt(attributes.chipvalue)).equals(20);
        attributes = chips[3].attributes();
        expect(parseInt(attributes.chipvalue)).equals(50);
        attributes = chips[4].attributes();
        expect(parseInt(attributes.chipvalue)).equals(100);
    })
})