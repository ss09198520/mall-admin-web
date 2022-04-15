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
 * 查詢電影
 *
 * @param title
 * @param data
 */
export function graphMovieByTitle(title: string) {
    return request({
        url: '/api/neo4j/v1/graphMovieByTitle?title=' + title,
        method: 'post',
    })
}

/**
 * 查詢電影
 *
 * @param personName
 */
export function graphMovieByPersonName(personName: string) {
    return request({
        url: '/api/neo4j/v1/graphMovieByPersonName?name=' + personName,
        method: 'post',
    })
}
