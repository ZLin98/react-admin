import store from "store"
const USER_KRY = "user_key"
export default {
    /**
     * 保存user
     */
    saveUser(user){
        // localStorage.setItem(USER_KRY,JSON.stringify(user));
        store.set(USER_KRY,user);
    },
    /**
     * 读取user
     */
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KRY)||"{}");
        return store.get(USER_KRY) || {};
    },
    /**
     * 移除user
     */
    removeUser() {
        // localStorage.removeItem(USER_KRY);
        store.remover(USER_KRY);
    }
}