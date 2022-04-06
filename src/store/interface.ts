import {RouteRecordRaw,RouteLocationNormalized} from "vue-router";

// 接口類型聲明
export interface UserState {
    token: string,
    nickname: string,
    avatar: string,
    roles: string[],
    perms: string[]
}

export interface AppState {
    device: string,
    sidebar: {
        opened: boolean,
        withoutAnimation: boolean
    },
    language:string,
    size:string
}

export interface SettingState {
    theme: string,
    tagsView: boolean,
    fixedHeader: boolean,
    showSettings: boolean,
    sidebarLogo: boolean
}

export interface PermissionState{
    routes:RouteRecordRaw[]
    addRoutes: RouteRecordRaw[]
}

export interface TagView extends Partial<RouteLocationNormalized> {
    title?: string
}

export interface TagsViewState{
    visitedViews: TagView[],
    cachedViews: (string)[]
}

// 頂級類型聲明
export interface RootStateTypes {
    user: UserState,
    app: AppState,
    settings: SettingState,
    permission:PermissionState,
    tagsView:TagsViewState
}
