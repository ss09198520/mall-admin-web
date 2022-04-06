import {useUserStoreHook} from "@/store/modules/user";
import {Directive, DirectiveBinding} from "vue";

/**
 * 按鈕權限校驗
 */
export const hasPerm: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // 「超級管理員」拥有所有的按鈕權限
        const roles = useUserStoreHook().roles;
        if (roles.includes('ROOT')) {
            return true
        }
        // 「其他角色」按鈕權限校驗
        const {value} = binding;
        if (value) {
            const requiredPerms = value; // DOM绑定需要的按鈕權限標示

            const hasPerm = useUserStoreHook().perms.some(perm => {
                return requiredPerms.includes(perm)
            })

            if (!hasPerm) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        } else {
            throw new Error("need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\"");
        }
    }
};

/**
 * 角色權限校驗
 */
export const hasRole: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const {value} = binding;
        if (value) {
            const requiredRoles = value; // DOM绑定需要的角色编碼

            const hasRole = useUserStoreHook().roles.some(perm => {
                return requiredRoles.includes(perm)
            })

            if (!hasRole) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        } else {
            throw new Error("need roles! Like v-has-role=\"['admin','test']\"");
        }
    }
};

