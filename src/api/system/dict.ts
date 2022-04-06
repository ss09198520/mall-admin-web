import request from "@/utils/request";

/**
 * 取得字典分頁列表
 *
 * @param queryParams
 */
export function listDictWithPage(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v2/dict/page',
        method: 'get',
        params: queryParams
    })
}

/**
 * 取得字典詳情
 *
 * @param id
 */
export function getDictDetail(id: number) {
    return request({
        url: '/youlai-admin/api/v2/dict/' + id,
        method: 'get'
    })
}


/**
 * 新增字典
 *
 * @param data
 */
export function addDict(data: object) {
    return request({
        url: '/youlai-admin/api/v2/dict',
        method: 'post',
        data: data
    })
}

/**
 * 修改字典
 *
 * @param id
 * @param data
 */
export function updateDict(id: number, data: object) {
    return request({
        url: '/youlai-admin/api/v2/dict/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 批量删除字典
 * @param ids 字典ID，多個以英文逗號(,)分割
 */
export function deleteDict(ids: string) {
    return request({
        url: '/youlai-admin/api/v2/dict/' + ids,
        method: 'delete',
    })
}

/**
 * 取得字典分頁列表
 *
 * @param queryParams
 */
export function listDictItemsWithPage(queryParams: object) {
    return request({
        url: '/youlai-admin/api/v2/dict/items/page',
        method: 'get',
        params: queryParams
    })
}


/**
 * 根據字典编號取得字典列表
 *
 * @param dictCode
 */
export function listDictsByCode(dictCode: string) {
    return request({
        url: '/youlai-admin/api/v2/dict/items',
        method: 'get',
        params: {dictCode: dictCode}
    })
}

/**
 * 取得字典詳情
 *
 * @param id
 */
export function getDictItemDetail(id: number) {
    return request({
        url: '/youlai-admin/api/v2/dict/items/' + id,
        method: 'get'
    })
}



/**
 * 新增字典項
 *
 * @param data
 */
export function addDictItem(data: object) {
    return request({
        url: '/youlai-admin/api/v2/dict/items',
        method: 'post',
        data: data
    })
}

/**
 * 修改字典項
 *
 * @param id
 * @param data
 */
export function updateDictItem(id: number, data: object) {
    return request({
        url: '/youlai-admin/api/v2/dict/items/' + id,
        method: 'put',
        data: data
    })
}

/**
 * 批量删除字典項
 * @param ids 字典項ID，多個以英文逗號(,)分割
 */
export function deleteDictItem(ids: string) {
    return request({
        url: '/youlai-admin/api/v2/dict/items/' + ids,
        method: 'delete',
    })
}
