import React, { Component } from 'react'
import "./header.less"
import { Modal } from "antd"
import menuList from "../../config/menuConfig"
import { withRouter } from "react-router-dom"
import memoeyUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"
import { formateDate } from "../../utils/dateUtils"
import { reqWeather } from "../../api/index"
import LinkButton from "../link-botton/linkBotton"


class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), //当前时间字符串
        dayPictureUrl: "", //天气图片
        weather: "",//天气文本
        temperature: ""
    }

    /**
     * 一般在此执行异步操作（ajax请求和启动定时器）
     */
    componentDidMount() {
        //获取时间
        this.getTime();
        //获取天气
        this.getWeather();
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now());
            //设置状态
            this.setState({ currentTime });
        }, 1000)
    }

    getWeather = async () => {
        const { dayPictureUrl, weather, temperature } = await reqWeather("重庆");
        this.setState({ dayPictureUrl, weather, temperature });
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path);
                if (cItem) {
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    logout = () => {
        Modal.confirm({
            title: '退出',
            content: '确定退出吗？',
            onOk: () => {
                storageUtils.removeUser();
                memoeyUtils.user = {}
                this.props.history.replace("/login");
            },
            onCancel() { },
        })
    }

    render() {
        const { currentTime, dayPictureUrl, weather, temperature } = this.state;
        const title = this.getTitle();
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{memoeyUtils.user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                        <span>{temperature}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
