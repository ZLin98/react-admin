import React, { Component } from 'react'
import { Form, Select, Input } from "antd"
import PropTypes from "prop-types"

const Item = Form.Item;
const Option = Select.Option;
/**
 * 修改分类的form   
 */
class UpdateForm extends Component {
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount() {
        //将form对象通过函数传入到父组件
        this.props.setForm(this.props.form)
    }

    render() { 
        const {categoryName} = this.props;
        //获取表单校验函数
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator("categoryName", {
                            initialValue: categoryName
                        })(<Input placeholder="请输入分类名称"></Input>)
                    }
                </Item>
            </Form>
        )
    }
}

export default UpdateForm = Form.create()(UpdateForm);