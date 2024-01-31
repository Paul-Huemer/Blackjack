import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ScreenManager from './ScreenManager.vue'

const app = createApp(ScreenManager)

app.use(createPinia())

app.mount('#app')
