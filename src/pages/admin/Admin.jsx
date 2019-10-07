import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import memoeyUtils from "../../utils/memoryUtils"
import { Layout } from "antd"
import Header from "../../components/header/header"
import LeftNav from "../../components/left-nav/left-nav"
import Home from "../home/home"
import Category from "../category/category"
import Bar from "../charts/bar"
import Line from "../charts/line"
import Pie from "../charts/pie"
import Product from "../product/product"
import Role from "../role/role"
import User from "../user/user"

const { Footer, Sider, Content } = Layout;
class Admin extends React.Component {
  render() {
    if (!memoeyUtils.user || !memoeyUtils.user._id) {
      return <Redirect to="/login" />
    }
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: 20, backgroundColor: "white" }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>一个人最大的破产是绝望；最大的资产是希望。</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin;