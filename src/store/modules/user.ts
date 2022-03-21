import { defineStore } from "pinia";
import { store } from "@/store";
import {UserState} from "@/store/interface";
import {localStorage} from "@/utils/storage";
import {getUserInfo, login, logout} from "@/api/login";
import {resetRouter} from "@/router";

const getDefaultState = () => {
    return {
        token: localStorage.get('token'),
        nickname: '',
        avatar: '',
        roles: [],
        perms: []
    }
}

export const useUserStore = defineStore({
   id:"user",
    state: ():UserState=>({
        token: localStorage.get('token') || '',
        nickname: '',
        avatar: '',
        roles: [],
        perms: []
    }),
    actions: {
        async RESET_STATE () {
            this.$reset()
        },
        /**
         * 用户登录请求
         * @param userInfo 登录用户信息
         *  username: 用户名
         *  password: 密码
         *  code: 验证码
         *  uuid: 匹配正确验证码的 key
         */
        login(userInfo: { username: string, password: string, code: string, uuid: string }) {
            const {username, password, code, uuid} = userInfo
            return new Promise((resolve, reject) => {
                login(
                    {
                        username: username.trim(),
                        password: password,
                        grant_type: 'captcha',
                        code: code,
                        uuid: uuid
                    }
                ).then(response => {
                    const {access_token, token_type} = response.data
                    const accessToken = token_type + " " + access_token
                    localStorage.set("token", accessToken)
                    this.token = accessToken
                    resolve(access_token)
                }).catch(error => {
                    reject(error)
                })
            })
            // return new Promise((resolve, reject) => {
            //     const {access_token, token_type} = {access_token: "2YotnFZFEjr1zCsicMWpAA" ,token_type: "example"}
            //     const accessToken = token_type + " " + access_token
            //     localStorage.set("token", accessToken)
            //     this.token = accessToken
            //     resolve(access_token)
            // })
            
        },
        /**
         *  获取用户信息（昵称、头像、角色集合、权限集合）
         */
        getUserInfo() {
            return new Promise(((resolve, reject) => {
                    // getUserInfo().then(response => {
                    //     const {data} = response
                    //     if (!data) {
                    //         return reject('Verification failed, please Login again.')
                    //     }
                    //     const {nickname, avatar, roles, perms} = data
                    //     if (!roles || roles.length <= 0) {
                    //         reject('getUserInfo: roles must be a non-null array!')
                    //     }
                    //     this.nickname = nickname
                    //     this.avatar = avatar
                    //     this.roles = roles
                    //     this.perms = perms
                    //     resolve(data)
                    // }).catch(error => {
                    //     reject(error)
                    // })
                    const {data} = {
                        data:{
                            nickname:'',
                            avatar:'',
                            roles:['ROOT','ADMIN','GUEST'],
                            perms:[],
                        }
                    }
                    if (!data) {
                        return reject('Verification failed, please Login again.')
                    }
                    const {nickname, avatar, roles, perms} = data
                    if (!roles || roles.length <= 0) {
                        reject('getUserInfo: roles must be a non-null array!')
                    }
                    this.nickname = nickname
                    this.avatar = avatar
                    this.roles = roles
                    this.perms = perms
                    resolve(data)
                })
            )
        },

        /**
         *  登出
         */
        logout() {
            return new Promise(((resolve, reject) => {
                logout().then(() => {
                    localStorage.remove('token')
                    this.RESET_STATE()
                    resetRouter()
                    resolve(null)
                }).catch(error => {
                    reject(error)
                })
            }))
        },

        /**
         * 清除 Token
         */
        resetToken(){
            return new Promise(resolve=>{
                localStorage.remove('token')
                this.RESET_STATE()
                resolve(null)
            })
        }
    }
})

export function useUserStoreHook() {
    return useUserStore(store);
}

