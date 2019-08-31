import ajax from "./ajax"

//封装每个参数的固定信息，上层调用者只用传入具体参数就行
//登陆
export const reqLogin = (username,password) => ajax("/login",{username,password},"POST")