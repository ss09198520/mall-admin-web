/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}


// 環境變量智能提示
interface ImportMetaEnv {
    NODE_ENV:string,
    VITE_APP_TITLE: string,
    VITE_APP_PORT: string,
    VITE_APP_BASE_API: string
}
