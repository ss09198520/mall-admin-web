import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

export const Layout = () => import( '@/layout/index.vue')

// 参數说明: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/redirect',
        component: Layout,
        meta: {hidden: true},
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        meta: {hidden: true}
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        meta: {hidden: true}
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: {title: 'dashboard', icon: 'dashboard', affix: true}
            },
        ]
    },
    {
        path: '/d3',
        component: Layout,
        name: 'd3',
        meta:{
            title:"d3.js",
            icon:"table",
            hidden:false,
            alwaysShow:null,
            roles:["ADMIN"]
        },
        children: [
            {
                path: 'charts',
                component: () => import('@/views/d3/index.vue'),
                name: 'charts-d3',
                meta: {title: 'charts-d3', icon: 'chart'},
                children: [
                    {
                        path: 'ForceBasedLabelPlacementI',
                        component: () => import('@/views/d3/components/D3-Chart/ForceBasedLabelPlacementI.vue'),
                        name: 'd3-ForceBasedLabelPlacementI',
                        meta: {title: 'Force-based I', noCache: true}
                    },
                    // {
                    //     path: 'ForceDirectedGraph',
                    //     component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraph.vue'),
                    //     name: 'd3-ForceDirectedGraph',
                    //     meta: {title: 'Force Directed Graph I', noCache: true}
                    // },
                    // {
                    //     path: 'ForceDirectedGraphI',
                    //     component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraphI.vue'),
                    //     name: 'd3-ForceDirectedGraphI',
                    //     meta: {title: 'Force Directed Graph II', noCache: true}
                    // },
                    // {
                    //     path: 'ForceDirectedGraphII',
                    //     component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraphII.vue'),
                    //     name: 'd3-ForceDirectedGraphII',
                    //     meta: {title: 'Force Directed Graph II', noCache: true}
                    // },
                    // {
                    //     path: 'ForceDirectedGraphIII',
                    //     component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraphIII.vue'),
                    //     name: 'd3-ForceDirectedGraphIII',
                    //     meta: {title: 'Force Directed Graph III', noCache: true}
                    // },
                    {
                        path: 'ForceHierarchyGraphI',
                        component: () => import('@/views/d3/components/D3-Chart/ForceHierarchyGraphI.vue'),
                        name: 'd3-ForceHierarchyGraphI',
                        meta: {title: 'Force Hierarchy Graph I', noCache: true}
                    },
                    {
                        path: 'ForceHierarchyGraphII',
                        component: () => import('@/views/d3/components/D3-Chart/ForceHierarchyGraphII.vue'),
                        name: 'd3-ForceHierarchyGraphII',
                        meta: {title: 'Force Hierarchy Graph II', noCache: true}
                    },
                    {
                        path: 'ForceDirectedGraphIIII',
                        component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraphIIII.vue'),
                        name: 'd3-ForceDirectedGraphIIII',
                        meta: {title: 'Force Directed Graph IIII', noCache: true}
                    },
                    {
                        path: 'ForceDirectedGraphMovie',
                        component: () => import('@/views/d3/components/D3-Chart/ForceDirectedGraphMovie.vue'),
                        name: 'd3-ForceDirectedGraphMovie',
                        meta: {title: 'Force Directed Graph Movie', noCache: true}
                    },

                ]
            },
        ]
    },
    // 404 page must be placed at the end !!!
    {
        path: '/:pathMatch(.*)',
        name: 'not-found',
        redirect: '/404',
        meta: {
            hidden: true
        }
    },

    // 外部链接
    /*{
        path: '/external-link',
        component: Layout,
        children: [
            {
                path: 'https://www.cnblogs.com/haoxianrui/',
                meta: { title: '外部链接', icon: 'link' }
            }
        ]
    }*/
    // 多級嵌套路由
    {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多級菜單', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜單一級'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜單二級'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜單三級-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜單三級-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})

export function resetRouter() {
    const newRouter = router;
    (router as any).matcher = (newRouter as any).matcher
}

export default router
