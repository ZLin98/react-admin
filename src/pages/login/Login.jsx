import React from "react"
import { Form, Icon, Input, Button } from 'antd';
import "./login.less"
import logo from "../../assets/images/logo.png"
import { reqLogin } from "../../api"
import { message } from "antd"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"
import {Redirect} from "react-router-dom"

class Login extends React.Component {

  /**
   * 两件事
   * 1.前台表单验证
   * 2.表单数据采集
   */
  handleSubmit = (event) => {
    //阻止事件的默认行为
    event.preventDefault();
    //得到form对象
    // const form = this.props.form;
    //获取表单的输入数据
    // const values = form.getFieldsValue();

    //antd 验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values;
        //直接在resolve里面返回的就是response.data
        const result = await reqLogin(username, password);
        if (result.status === 0) {
          message.success("登陆成功");
          const user = result.data;
          memoryUtils.user = user;
          storageUtils.saveUser(user);
          //不同push的原因，登陆成功不需要回退打登陆页面，直接替换掉就行
          this.props.history.replace("/");
        } else {
          message.error(result.msg);
        }
      }
    });

  }

  render() {
    //判断用户是否已经登陆
    if (memoryUtils.user&&memoryUtils.user._id) {
      return <Redirect to="/" />
    }
    //具有强大功能的form对象
    const form = this.props.form;
    const { getFieldDecorator } = form;
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
                //声明书规则
                rules: [
                  { required: true, message: '请输入用户名!' },
                  { min: 4, message: '用户名至少4位!' },
                  { max: 12, message: '用户名最多12位!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由字母数字下划线组成!' },
                ],
                //指定初始值
                initialValue: 'admin'
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
                rules: [
                  { required: true, message: '请输入密码!' },
                  { min: 4, message: '密码至少4位!' },
                  { max: 12, message: '密码最多12位!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须由字母数字下划线组成!' },
                ],
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
 *      d. bind()
 *      e. create()()/getFieldDecorator()() 
 *  1.3 高阶函数更新状态，具有更好的扩展性
 * 2，高阶组件
 *    1. 本质是一个函数，
 *    2. 接收一个组件（被包装组件），返回一个组件（包装组件），包装组件会像被包装组件传入特定属性
 *    3. 扩展组件的功能 
 */


/**
 *
 *  async和await
 *  1. 作用?
 *    简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
 *    以同步编码(没有回调函数了)方式实现异步流程
 *  2. 哪里写await?
 *     在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
 * 3. 哪里写async?
 *    await所在函数(最近的)定义的左侧写async
 */
export default Login = Form.create()(Login);