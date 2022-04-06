/**
 * window.localStorage 瀏覽器永久缓存
 */
export const localStorage = {
    // 設置永久缓存
    set(key: string, val: any) {
        window.localStorage.setItem(key, JSON.stringify(val));
    },
    // 取得永久缓存
    get(key: string) {
        let json: any = window.localStorage.getItem(key);
        return JSON.parse(json);
    },
    // 移除永久缓存
    remove(key: string) {
        window.localStorage.removeItem(key);
    },
    // 移除全部永久缓存
    clear() {
        window.localStorage.clear();
    }
};

/**
 * window.sessionStorage 瀏覽器臨時缓存
 */
export const sessionStorage = {
    // 設置臨時缓存
    set(key: string, val: any) {
        window.sessionStorage.setItem(key, JSON.stringify(val));
    },
    // 取得臨時缓存
    get(key: string) {
        let json: any = window.sessionStorage.getItem(key);
        return JSON.parse(json);
    },
    // 移除臨時缓存
    remove(key: string) {
        window.sessionStorage.removeItem(key);
    },
    // 移除全部臨時缓存
    clear() {
        window.sessionStorage.clear();
    }
};
