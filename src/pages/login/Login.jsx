import React from "react"
import { Form, Icon, Input, Button} from 'antd';
import "./login.less"
import logo from "./images/logo.png"

class Login extends React.Component {

  /**
   * 两件事
   * 1.前台表单验证
   * 2.表单数据采集
   */
  handleSubmit= (event)=>{
    //阻止事件的默认行为
    event.preventDefault();
    //得到form对象
    const form = this.props.form;
    //获取表单的输入数据
    const values = form.getFieldsValue();

    
  }

  render() {
    //具有强大功能的form对象
    const form = this.props.form;
    const {getFieldDecorator} = form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
        {/* getFieldDecorator高阶函数 */}
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
          </Button>
        </Form.Item>
      </Form>
        </section>
      </div>
    )
  }
}


/**
 * 
 * 1，高阶函数
 *  1.1 一类特别的函数
 *      a. 接受函数类型的参数
 *      b. 返回值为函数
 *  1.2 常见的高阶函数
 *      a. setTimeout()
 *      b. Promise(()=>{}) then()
 *      c. 数组遍历相关的很多方法foreach()/filter()/map()等
 *  1.3 高阶函数更新状态，具有更好的扩展性
 * 2，高阶组件
 */
export default Form.create()(Login);