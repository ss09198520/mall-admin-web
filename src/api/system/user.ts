import request from "@/utils/request";

/**
 * 取得用戶分頁列表
 *
 * @param queryParams
 */
export function listUsersWithPage(queryParams: any) {
    return request({
        url: '/youlai-admin/api/v1/users/page',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得用戶表單詳細資料
 *
 * @param userId
 */
export function getUserFormDetail(userId: any) {
    return request({
        url: '/youlai-admin/api/v1/users/' + userId + '/form_detail',
        method: 'get'
    })
}

/**
 * 新增用戶
 *
 * @param data
 */
export function addUser(data: any) {
    return request({
        url: '/youlai-admin/api/v1/users',
        method: 'post',
        data: data
    })
}

/**
 * 修改用戶
 *
 * @param id
 * @param data
 */
export function updateUser(id: number, data: any) {
    return request({
        url: '/youlai-admin/api/v1/users/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 修改用戶部分資訊
 *
 * @param id
 * @param data
 */
export function updateUserPart(id: number, data: any) {
    return request({
        url: '/youlai-admin/api/v1/users/' + id,
        method: 'patch',
        data: data
    })
}


/**
 * 删除用戶
 * @param ids
 */
export function deleteUsers(ids: number) {
    return request({
        url: '/youlai-admin/api/v1/users/' + ids,
        method: 'delete',
    })
}
