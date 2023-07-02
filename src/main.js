import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "./router"

const app = createApp(App)
Object.keys(icons).forEach(key => {
    app.component(key, icons[key])
})
app.use(ElementPlus)
app.use(router).mount('#app')