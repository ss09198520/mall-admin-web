import request from '@/utils/request'

/**
 * 取得權限分頁列表
 *
 * @param queryParams
 */
export function listPermsWithPage(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v1/permissions/page',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得權限列表
 *
 * @param queryParams
 */
export function listPerms(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v1/permissions',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得權限詳細
 *
 * @param id
 */
export function getPermDetail(id: number) {
    return request({
        url: '/youlai-admin/api/v1/permissions/' + id,
        method: 'get'
    })
}

/**
 * 添加權限
 *
 * @param data
 */
export function addPerm(data: object) {
    return request({
        url: '/youlai-admin/api/v1/permissions',
        method: 'post',
        data: data
    })
}

/**
 * 更新權限
 *
 * @param id
 * @param data
 */
export function updatePerm(id: number, data: object) {
    return request({
        url: '/youlai-admin/api/v1/permissions/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 批量删除權限，多個以英文逗號(,)分割
 *
 * @param ids
 */
export function deletePerms(ids: string) {
    return request({
        url: '/youlai-admin/api/v1/permissions/' + ids,
        method: 'delete'
    })
}

