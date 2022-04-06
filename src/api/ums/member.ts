import request from '@/utils/request'

/**
 * 取得會員分頁列表
 *
 * @param queryParams
 */
export function listMembersWithPage(queryParams:object) {
    return request({
        url: '/mall-ums/api/v1/members',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得會員詳情
 *
 * @param id
 */
export function getMemberDetail(id:number) {
    return request({
        url: '/mall-ums/api/v1/members/' + id,
        method: 'get'
    })
}

/**
 * 添加會員
 *
 * @param data
 */
export function addMember(data:object) {
    return request({
        url: '/mall-ums/api/v1/members',
        method: 'post',
        data: data
    })
}

/**
 * 添加會員
 *
 * @param id
 * @param data
 */
export function updateMember(id:number, data:object) {
    return request({
        url: '/mall-ums/api/v1/members/' + id,
        method: 'put',
        data: data
    })
}
