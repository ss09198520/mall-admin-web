import request from "@/utils/request";

/**
 * 取得商品分類列表
 *
 * @param queryParams
 */
export function listCategories(queryParams:object){
    return request({
        url: '/mall-pms/api/v1/categories',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得商品分類級聯器樹形列表
 *
 * @param queryParams
 */
export function listCascadeCategories(queryParams:object) {
    return request({
        url: '/mall-pms/api/v1/categories/cascade',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得商品分類詳情
 *
 * @param id
 */
export function getCategoryDetail(id:number){
    return request({
        url: '/mall-pms/api/v1/categories/' + id,
        method: 'get'
    })
}

/**
 * 添加商品分類
 *
 * @param data
 */
export function addCategory(data:object){
    return request({
        url: '/mall-pms/api/v1/categories',
        method: 'post',
        data: data
    })
}

/**
 * 修改商品分類
 *
 * @param id
 * @param data
 */
export function updateCategory(id:number, data:object) {
    return request({
        url: '/mall-pms/api/v1/categories/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 删除商品分類
 *
 * @param ids
 */
export function deleteCategories(ids:string) {
    return request({
        url: '/mall-pms/api/v1/categories/' + ids,
        method: 'delete'
    })
}

/**
 * 選擇性修改商品分類
 *
 * @param id
 * @param data
 */
export function updateCategoryPart(id:number, data:object) {
    return request({
        url: '/mall-pms/api/v1/categories/' + id,
        method: 'patch',
        data: data
    })
}
