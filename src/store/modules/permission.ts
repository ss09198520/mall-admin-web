import {PermissionState} from "@/store/interface";
import {RouteRecordRaw} from 'vue-router'
import {constantRoutes} from '@/router'
import {listRoutes} from "@/api/system/menu";
import {defineStore} from "pinia";
import {store} from "@/store";

const modules = import.meta.glob("../../views/**/**.vue");
export const Layout = () => import( '@/layout/index.vue')

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.roles) {
        if (roles.includes('ROOT')) {
            return true
        }
        return roles.some(role => {
            if (route.meta?.roles !== undefined) {
                return (route.meta.roles as string[]).includes(role);
            }
        })
    }
    return false
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach(route => {
        const tmp = {...route} as any
        if (hasPermission(roles, tmp)) {
            if (tmp.component == 'Layout') {
                tmp.component = Layout
            } else {
                const component = modules[`../../views/${tmp.component}.vue`] as any;
                if (component) {
                    tmp.component = modules[`../../views/${tmp.component}.vue`];
                } else {
                    tmp.component = modules[`../../views/error-page/404.vue`];
                }
            }
            res.push(tmp)

            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
        }
    })
    return res
}


export const usePermissionStore = defineStore({
    id: "permission",
    state: (): PermissionState => ({
        routes: [],
        addRoutes: []
    }),
    actions: {
        setRoutes(routes: RouteRecordRaw[]) {
            this.addRoutes = routes
            this.routes = constantRoutes.concat(routes)
        },
        generateRoutes(roles: string[]) {
            return new Promise((resolve, reject) => {
                // const asyncRoutes = JSON.parse('[{"path":"/system","component":"Layout","name":"1","meta":{"title":"系统管理","icon":"table","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"user","component":"system/user/index","name":"2","meta":{"title":"用戶管理","icon":"user","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"role","component":"system/role/index","name":"3","meta":{"title":"角色管理","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"menu","component":"system/menu/index","name":"4","meta":{"title":"菜單管理","icon":"tree-table","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"dept","component":"system/dept/index","name":"5","meta":{"title":"部門管理","icon":"tree","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"dict","component":"system/dict/index","name":"6","meta":{"title":"字典管理","icon":"education","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"client","component":"system/client/index","name":"7","meta":{"title":"客户端管理","icon":"tab","hidden":true,"alwaysShow":null,"roles":["ADMIN"]}}]},{"path":"/sms","component":"Layout","name":"11","meta":{"title":"營銷管理","icon":"number","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"advert","component":"sms/advert/index","name":"12","meta":{"title":"字典管理2","icon":"documentation","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}}]},{"path":"/pms","component":"Layout","name":"13","meta":{"title":"商品管理","icon":"number","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"goods","component":"pms/goods/index","name":"14","meta":{"title":"商品列表","icon":"component","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"brand","component":"pms/brand/index","name":"15","meta":{"title":"品牌管理","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"category","component":"pms/category/index","name":"16","meta":{"title":"商品分类","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"goods-detail","component":"pms/goods/detail","name":"17","meta":{"title":"商品上架","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}}]},{"path":"/oms","component":"Layout","name":"18","meta":{"title":"订单管理","icon":"shopping","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"order","component":"oms/order/index","name":"19","meta":{"title":"订单列表","icon":"component","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}}]},{"path":"/ums","component":"Layout","name":"21","meta":{"title":"会员管理","icon":"user","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"user","component":"ums/member/index","name":"22","meta":{"title":"会员列表","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}}]}]')
                const asyncRoutes = JSON.parse('[{"path":"/system","component":"Layout","name":"1","meta":{"title":"系统管理","icon":"table","hidden":false,"alwaysShow":null,"roles":["ADMIN"]},"children":[{"path":"user","component":"system/user/index","name":"2","meta":{"title":"帳戶管理","icon":"user","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"role","component":"system/role/index","name":"3","meta":{"title":"角色管理","icon":"peoples","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"menu","component":"system/menu/index","name":"4","meta":{"title":"菜單管理","icon":"tree-table","hidden":false,"alwaysShow":null,"roles":["ADMIN"]}},{"path":"client","component":"system/client/index","name":"7","meta":{"title":"客户端管理","icon":"tab","hidden":true,"alwaysShow":null,"roles":["ADMIN"]}}]}]')
                // const asyncRoutes = [
                //     { path: '/system', component: Layout, alwaysShow: true, name: '系统管理', hidden: false ,meta : {title:'系统管理',icon:'table',roles: ['ROOT','ADMIN']},
                //         children: [
                //         { path: 'user', component: () => import('@/views/system/user/index.vue'), alwaysShow: true, name: '用戶管理', hidden: false ,meta : {title:'用戶管理',icon:'user',roles: ['ROOT','ADMIN']}},
                //         { path: 'role', component: () => import('@/views/system/role/index.vue'), alwaysShow: true, name: '角色管理', hidden: false ,meta : {title:'角色管理',icon:'peoples',roles: ['ROOT','ADMIN']}},
                //         { path: 'menu', component: () => import('@/views/system/menu/index.vue'), alwaysShow: true, name: '菜單管理', hidden: false ,meta : {title:'菜單管理',icon:'tree-table',roles: ['ROOT','ADMIN']}},
                //         { path: 'dept', component: () => import('@/views/system/dept/index.vue'), alwaysShow: true, name: '部門管理2', hidden: false ,meta : {title:'部門管理2',icon:'tree',roles: ['ROOT','ADMIN']}}]
                //     },
                // ]
                // console.log('asyncRoutes' , asyncRoutes)
                let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                this.setRoutes(accessedRoutes)
                resolve(accessedRoutes)
                // listRoutes().then(response => {
                //     const asyncRoutes = response.data
                //     console.log('asyncRoutes',asyncRoutes)
                //     let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                //     this.setRoutes(accessedRoutes)
                //     resolve(accessedRoutes)
                // }).catch(error => {
                //     reject(error)
                // })
            })
        }
    }
})

export function usePermissionStoreHook() {
    return usePermissionStore(store);
}
