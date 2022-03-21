import request from "@/utils/request";

/**
 * 登入
 * @param data
 */
export function login(data: object) {
    return request({
        url: '/youlai-auth/oauth/token',
        method:'post',
        params: data,
        headers: {
            'Authorization': 'Basic bWFsbC1hZG1pbi13ZWI6MTIzNDU2' // 客戶端信息Base64明文：mall-admin-web:123456
        }
    })
}

/**
 * 登錄成功後獲取用戶信息（包括用戶頭像、權限列表等）
 */
export function getUserInfo() {
    return request({
        url: '/youlai-admin/api/v1/users/me',
        method: 'get'
    })
}

/**
 * 註銷
 */
export function logout() {
    return request({
        url: '/youlai-auth/oauth/logout',
        method: 'delete'
    })
}

/**
 * 獲取圖片驗證碼
 */
export function getCaptcha() {
    return request({
        url: '/captcha?t='+(new Date()).getTime().toString(),
        method: 'get'
    })
}