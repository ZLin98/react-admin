import axios from "axios"
import {message} from "antd"

/**
 * 封装异步的ajax请求
 * @param {*} url 请求地址
 * @param {*} data 请求数据
 * @param {*} method 请求方式
 * 优化ajax请求：统一进行异常处理，在外层自己创建一个promise对象，在请求出错是不是调用reject，而是提示错误信息
 */
export default function ajax(url, data = {}, method = 'GET') {

    // axios.defaults.headers = {
    //     'Content-type': 'application/x-www-form-urlencoded'
    // }
    return new Promise((resolve,reject) => {
        let promise;
        if (method === 'GET') {
            promise = axios.get(url, 
                { params: data },//配置参数params
            );
        } else {
            promise = axios.post(url,data);
        }
        //如果成功了，调用resolve方法
        promise.then(response => { 
            resolve(response.data);
        //如果失败了，不调用reject方法
        }).catch(error => {
            message.error("请求失败，错误信息：",error.message);
        })
    })
    

}