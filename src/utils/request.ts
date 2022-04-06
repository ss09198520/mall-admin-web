import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {localStorage} from "@/utils/storage";
import {useUserStoreHook} from "@/store/modules/user";

// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API as any,
    timeout: 50000,
    headers: {'Content-Type': 'application/json;charset=utf-8'}
})

// 請求前攔截
service.interceptors.request.use(
    (config) => {
        if (!config?.headers) {
            throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
        }
        if (useUserStoreHook().token) {
            config.headers.Authorization = `${localStorage.get('token')}`;
        }
        return config
    }, (error) => {
        return Promise.reject(error);
    }
)

// 回應後攔截
service.interceptors.response.use(
    ({data}) => {
        // parse response
        const {code, msg} = data;
        if (code === '00000') {
            return data;
        } else {
            ElMessage({
                message: msg || '系统發生異常',
                type: 'error'
            })
            return Promise.reject(new Error(msg || 'Error'))
        }
    },
    (error) => {
        const {code, msg} = error.response.data
        if (code === 'A0230') {  // token 過期
            localStorage.clear(); // 清除瀏覽器儲存空間
            window.location.href = '/'; // 返回登入夜
            ElMessageBox.alert('當前頁面已失效，請重新登入', '提示', {})
                .then(() => {
                })
                .catch(() => {
                });
        } else {
            ElMessage({
                message: msg || '系统發生異常',
                type: 'error'
            })
        }
        return Promise.reject(new Error(msg || 'Error'))
    }
);

// 導出 axios instance
export default service
