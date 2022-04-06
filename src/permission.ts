import router from "@/router";
import {ElMessage} from "element-plus";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
NProgress.configure({showSpinner: false}) // 進度環顯示/隐藏

// 白名單
const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, form, next) => {
    NProgress.start()

    const hasToken =useUserStoreHook().token
    if (hasToken) {
        // 如果登入成功，跳轉到首頁
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            const hasGetUserInfo =useUserStoreHook().roles.length > 0
            if (hasGetUserInfo) {
                next()
            } else {
                try {
                    await useUserStoreHook().getUserInfo()
                    const roles =useUserStoreHook().roles
                    const accessRoutes:any = await usePermissionStoreHook().generateRoutes(roles)
                    accessRoutes.forEach((route: any) => {
                        router.addRoute(route)
                    })
                    next({...to, replace: true})
                } catch (error) {
                    // remove token and go to login page to re-login
                    await useUserStoreHook().resetToken()
                    ElMessage.error(error as any || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
