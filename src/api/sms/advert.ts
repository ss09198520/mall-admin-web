import request from '@/utils/request'

/**
 * 取得廣告分頁列表
 *
 * @param queryParams
 */
export function listAdvertsWithPage(queryParams: object) {
    return request({
        url: '/mall-sms/api/v1/adverts',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得廣告詳情
 *
 * @param id
 */
export function getAdvertDetail(id:number) {
    return request({
        url: '/mall-sms/api/v1/adverts/' + id,
        method: 'get'
    })
}

/**
 * 添加廣告
 *
 * @param data
 */
export function addAdvert(data: object) {
    return request({
        url: '/mall-sms/api/v1/adverts',
        method: 'post',
        data: data
    })
}

/**
 * 修改廣告
 *
 * @param id
 * @param data
 */
export function updateAdvert(id: number, data: object) {
    return request({
        url: '/mall-sms/api/v1/adverts/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 删除廣告
 *
 * @param ids
 */
export function deleteAdverts(ids:string) {
    return request({
        url: '/mall-sms/api/v1/adverts/' + ids,
        method: 'delete'
    })
}
