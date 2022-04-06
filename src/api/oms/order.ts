import request from '@/utils/request'

/**
 * 取得訂單分頁列表
 *
 * @param queryParams
 */
export function listOrdersWithPage(queryParams: object) {
    return request({
        url: '/mall-oms/api/v1/orders',
        method: 'get',
        params: queryParams
    })
}


/**
 * 取得訂單詳情
 *
 * @param orderId
 */
export function getOrderDetail(orderId: number) {
    return request({
        url: '/mall-oms/api/v1/orders/' + orderId,
        method: 'get'
    })
}
