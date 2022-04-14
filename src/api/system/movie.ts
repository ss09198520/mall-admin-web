import request from "@/utils/request";

/**
 * 新增用戶
 *
 * @param data
 */
export function graphMovie(data: any) {
    return request({
        url: '/api/neo4j/v1/graphMovie',
        method: 'post',
    })
}

/**
 * 修改用戶
 *
 * @param title
 * @param data
 */
export function graphMovieByTitle(title: string, data: any) {
    return request({
        url: '/api/neo4j/v1/graphByTitle?name=' + title,
        method: 'post',
    })
}
