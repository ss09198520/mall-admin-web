import request from '@/utils/request'

/**
 * 取得路由列表
 */
export function listRoutes() {
    return request({
        url: '/youlai-admin/api/v2/menus/route',
        method: 'get'
    })
}

/**
 * 獲取(表格)菜單列表
 *
 * @param queryParams
 */
export function listTableMenus(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v1/menus/table',
        method: 'get',
        params: queryParams
    })
}

/**
 * 獲取(下拉)菜單列表
 */
export function listSelectMenus() {
    return request({
        url: '/youlai-admin/api/v1/menus/select',
        method: 'get'
    })
}

/**
 * 獲取(樹狀下拉)菜單列表
 */
export function listTreeSelectMenus() {
    return request({
        url: '/youlai-admin/api/v1/menus/tree_select',
        method: 'get'
    })
}


/**
 * 獲取菜單詳細
 * @param id
 */
export function getMenuDetail(id: number) {
    return request({
        url: '/youlai-admin/api/v1/menus/' + id,
        method: 'get'
    })
}

/**
 * 添加菜單
 *
 * @param data
 */
export function addMenu(data: object) {
    return request({
        url: '/youlai-admin/api/v1/menus',
        method: 'post',
        data: data
    })
}

/**
 * 修改菜單
 *
 * @param id
 * @param data
 */
export function updateMenu(id: number, data: object) {
    return request({
        url: '/youlai-admin/api/v1/menus/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 批量删除菜單
 *
 * @param ids 菜單ID，多個以英文逗號(,)分割
 */
export function deleteMenus(ids: string) {
    return request({
        url: '/youlai-admin/api/v1/menus/' + ids,
        method: 'delete'
    })
}
