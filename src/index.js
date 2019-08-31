import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import memoryUtils from "./utils/memoryUtils"
import storageUtils from "./utils/storageUtils"

//将本地的的数据读取到内存中
const user = storageUtils.getUser();
memoryUtils.user=user;
ReactDOM.render(<App />,document.getElementById("root"))