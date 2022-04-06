import request from '@/utils/request'

/**
 * 取得角色頁面列表
 *
 * @param queryParams
 */
export function listRolesWithPage(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v1/roles/page',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得角色列表
 *
 * @param queryParams
 */
export function listRoles(queryParams?: object) {
    return request({
        url: '/youlai-admin/api/v1/roles',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得角色詳細資訊
 *
 * @param id
 */
export function getRoleDetail(id: number) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + id,
        method: 'get'
    })
}

/**
 * 新增角色
 *
 * @param data
 */
export function addRole(data: object) {
    return request({
        url: '/youlai-admin/api/v1/roles',
        method: 'post',
        data: data
    })
}

/**
 * 更新角色
 *
 * @param id
 * @param data
 */
export function updateRole(id: number, data: object) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 批量删除角色，多個以英文逗號(,)分割
 *
 * @param ids
 */
export function deleteRoles(ids: string) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + ids,
        method: 'delete'
    })
}


/**
 * 取得角色的菜單列表
 *
 * @param roleId
 */
export function listRoleMenuIds(roleId: number) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + roleId + '/menu_ids',
        method: 'get',
    })
}

/**
 * 修改角色的菜單
 *
 * @param roleId
 * @param menuIds
 */
export function updateRoleMenu(roleId: number, menuIds: Array<Number>) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + roleId + '/menus',
        method: 'put',
        data: {menuIds: menuIds}
    })
}


/**
 * 取得角色的權限列表
 *
 * @param roleId
 */
export function listRolePerms(roleId: number, menuId: number) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + roleId + '/permissions',
        method: 'get',
        params: {menuId: menuId}
    })
}

/**
 * 保存角色權限
 *
 * @param menuId 菜單ID，歸類權限
 * @param roleId
 * @param permIds
 */
export function saveRolePerms(roleId: number, menuId: number, permIds: Array<number>) {
    return request({
        url: '/youlai-admin/api/v1/roles/' + roleId + '/permissions',
        method: 'put',
        data: {menuId: menuId, permIds: permIds}
    })
}
