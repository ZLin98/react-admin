import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom"
import './left-nav.less'
import logo from "../../assets/images/logo.png"
import { Menu, Icon } from 'antd';
import menuList from "../../config/menuConfig"

const { SubMenu } = Menu;

class LeftNav extends Component {

    componentWillMount () {
        this.menuNode=this.getMenuNode(menuList)
    }

    /**
     * 根据menu数据数组，生成标签数组
     * 使用map()+递归调用
     */

    // {
    //     title: '首页', // 菜单标题名称
    //     key: '/home', // 对应的path
    //     icon: 'home', // 图标名称
    //     children: [], // 可能有也可能没有
    //   }
    getMenuNode_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {
                            this.getMenuNode(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    getMenuNode = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((<Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>));
            } else {
                //获取每次打开子菜单的菜单项
                const cItem = item.children.find(cItem => cItem.key === path)
                //保存打开的子菜单，如果有子菜单打开，再次刷新就打开菜单
                if(cItem) {
                    this.openKey = item.key;
                }
                pre.push((<SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                    }
                >
                    {
                        this.getMenuNode(item.children)
                    }
                </SubMenu>));
            }
            return pre;
        }, [])
    }
    render() {
        //得到当前请求的路由地址
        const path = this.props.location.pathname;
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="" />
                    <h1>数据后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys = {[path]}
                    defaultOpenKeys={[this.openKey]}
                >
                    {/* 根据menuList动态生成左侧菜单 */}
                    {
                        this.menuNode
                    }
                    {/* <Menu.Item key="/home">
                        <Link to="/home">
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        title={
                            <span>
                                <Icon type="mail" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to="/category">
                                <Icon type="mail" />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to="/product">
                                <Icon type="mail" />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                        </SubMenu> */}
                </Menu>
            </div>
        )
    }
}

/**
 * 高阶组件，然非路由组件能够得到history/location/match
 */
export default withRouter(LeftNav)
