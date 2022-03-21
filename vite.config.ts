import {UserConfig, ConfigEnv, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons';
// 如果編輯器提示 path 模塊找不到，則可以安裝一下 @types/node -> npm i @types/node -D
import path from 'path'

// @see: https://gitee.com/holysheng/vite2-config-description/blob/master/vite.config.ts

export default ({command, mode}: ConfigEnv): UserConfig => {
    // 獲取 .env 環境配置文件
    const env = loadEnv(mode, process.cwd())

    return (
        {
            plugins: [
                vue(),
                viteSvgIcons({
                    // 指定需要緩存的圖標文件夾
                    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                    // 指定symbolId格式
                    symbolId: 'icon-[dir]-[name]',
                })

            ],
            // 本地反向代理解決瀏覽器跨域限制
            server: {
                host: 'localhost',
                port: Number(env.VITE_APP_PORT),
                open: true, // 自動開啟瀏覽器
                proxy: {
                    [env.VITE_APP_BASE_API]: {
                        target: 'http://localhost:9999',
                        changeOrigin: true,
                        rewrite: path => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
                    }
                }
            },
            resolve: {
                // Vite 設置別名路徑
                alias: {
                    "@": path.resolve("./src"),  // 相對路徑別名配置，@表示src
                }
            }
        }
    )
}