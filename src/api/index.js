import ajax from "./ajax"
import jsonp from "jsonp"
import {
    message
} from "antd"

//封装每个参数的固定信息，上层调用者只用传入具体参数就行
//登陆
export const reqLogin = (username, password) => ajax("/login", {
    username,
    password
}, "POST")

//jsonp 请求获取天气信息
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resovle, reject) => {
        //jsonp请求
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const {
                    dayPictureUrl,
                    weather,
                    temperature
                } = data.results[0].weather_data[0];
                resovle({dayPictureUrl, weather, temperature});
            } else {
                message.error("获取天气信息失败")
            }
        })
    })
}
/**
 * jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */