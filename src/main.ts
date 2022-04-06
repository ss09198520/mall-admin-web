import {createApp, Directive} from 'vue'
import App from './App.vue'
import router from "@/router";

import {store} from "@/store";
import Pagination from '@/components/Pagination/index.vue'

import {localStorage} from "@/utils/storage";
import 'virtual:svg-icons-register';
import '@/permission'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

// 國際化
import i18n from "@/lang/index";

// 自定義樣式
import '@/styles/index.scss'

// 全局方法
import {listDictsByCode} from '@/api/system/dict'

const app = createApp(App)

// 自定義指令
import * as directive from "@/directive";

Object.keys(directive).forEach(key => {
    app.directive(key, (directive as { [key: string]: Directive })[key]);
});

// 全局方法
app.config.globalProperties.$listDictsByCode = listDictsByCode

// vite + vue 3 + type script for devtools enable
const win: any = window
if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
        win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
}

// 注册全局组件
app.component('Pagination', Pagination)
    .use(store)
    .use(router)
    .use(ElementPlus, {size: localStorage.get('size') || 'small'})
    .use(i18n)
    .mount('#app')
