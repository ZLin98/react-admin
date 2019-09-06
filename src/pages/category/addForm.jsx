import React, { Component } from 'react'
import { Form, Select, Input } from "antd"
import PropTypes from "prop-types"

const Item = Form.Item;
const Option = Select.Option;
/**
 * 添加分类的form   
 */
class AddForm extends Component {
    static propTypes = {
        categoryList:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount() {
        //将form对象通过函数传入到父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const {categoryList,parentId} = this.props;
                //获取表单校验函数
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator("parentId", {
                            initialValue: parentId
                        })(<Select>
                            <Option value="0">一级分类</Option>
                            {
                                categoryList.map(item => <Option value={item._id}>{item.name}</Option>)
                            }
                        </Select>)
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator("categoryName", {
                            initialValue: "",
                            rules:[{
                                required:true,message:"分类名称必须输入"
                            }]
                        })(<Input placeholder="请输入分类名称"></Input>)
                    }
                </Item>
            </Form>
        )
    }
}

export default AddForm = Form.create()(AddForm);