import React, { Component } from 'react'
import { Card, Table, Icon, Button, message, Modal } from "antd"
import LinkButton from "../../components/link-botton/linkBotton"
import { reqGetCategoryList, reqAddCategory, reqUpdateCategory } from "../../api/index"
import AddForm from "./addForm"
import UpdateForm from "./updateForm"
import PropTypes from "prop-types"

export default class Category extends Component {
    state = {
        loading: false,
        categoryList: [],//一级
        subCategoryList: [],//二级
        parentId: "0",
        parentName: "",
        showStatus: 0 //1显示添加 2显示修改

    }

    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                dataIndex: '',
                render: (categoryList) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdateModal(categoryList)}>修改分类</LinkButton>
                        {
                            this.state.parentId === "0" ?
                                <LinkButton onClick={() =>
                                    this.showSubCategroyList(categoryList)
                                }>查看子分类</LinkButton> : null
                        }
                    </span>
                )

            }
        ];
    }
    componentWillMount() {
        //初始化列数据
        this.initColumns();
    }

    componentDidMount() {
        this.getCategoryList();
    }

    /**
     * 显示二级分类
     */
    showSubCategroyList = (categoryList) => {
        this.setState({ parentId: categoryList._id, parentName: categoryList.name }, () => {
            this.getCategoryList();
        });
        this.getCategoryList();
    }

    /**
     * 显示一级分类，就是点击一级分类显示原来的一级分类
     */
    showCategroyList = () => {
        this.setState(
            {
                parentId: "0",
                parentName: "",
                subCategoryList: []
            }
        );
    }
    /**
     * parentId 可以传可以不传，不传默认为状态里面的ID
     */
    getCategoryList = async (parentId) => {
        this.setState({ loading: true });
        parentId = parentId || this.state.parentId;
        const result = await reqGetCategoryList(parentId);
        this.setState({ loading: false });
        if (result.status === 0) {
            if (parentId === "0") {
                this.setState({ categoryList: result.data })
            } else {
                this.setState({ subCategoryList: result.data })
            }
        } else {
            message.error("获取分类列表失败");
        }
    }

    showAddModal = () => {
        this.setState({
            showStatus: 1,
        });
    };

    showUpdateModal = (category) => {
        this.category = category;
        this.setState({
            showStatus: 2

        });
    };

    handleCancel = e => {
        //清除输入数据
        this.form.resetFields();
        //隐藏form
        this.setState({
            showStatus: 0
        });
    };

    addCategory = () => {

        //只有表单验证通过才可以发请求进行修改
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //隐藏modal
                this.setState({
                    showStatus: 0
                })
                //准备数据
                const { categoryName, parentId } = values;
                //清除输入数据
                this.form.resetFields();
                //发请求修改
                const result = await reqAddCategory(categoryName, parentId);
                if (result.status === 0) {
                    //重新显示列表
                    this.getCategoryList();
                } else {
                    message.error(result.msg)
                }
            }
        })
    }

    updateCategory = () => {
        //只有表单验证通过才可以发请求进行修改
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //隐藏modal
                this.setState({
                    showStatus: 0
                })
                //准备数据
                const categoryId = this.category._id;
                const { categoryName } = values;
                //清除输入数据
                this.form.resetFields();
                //发请求修改
                const result = await reqUpdateCategory({ categoryId, categoryName });
                if (result.status === 0) {

                    if (categoryId === this.state.parentId) {
                        //重新获取当前的分类列表
                        this.getCategoryList();
                    } else if (categoryId === "0") {
                        this.getCategoryList("0");
                    }
                } else {
                    message.error(result.msg)
                }
            }
        })

    }
    render() {
        const { categoryList, loading, parentId, subCategoryList, parentName, showStatus } = this.state;
        const category = this.category || {};
        const title = this.state.parentId === "0" ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategroyList}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={this.showAddModal}>
                <Icon type="plus" />
                添加
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table bordered rowKey="_id"
                    dataSource={parentId === "0" ? categoryList : subCategoryList}
                    columns={this.columns}
                    loading={loading}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categoryList={categoryList} parentId={parentId} setForm={(form) => {
                        this.form = form;
                    }} />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name}
                        setForm={(form) => {
                            this.form = form;
                        }} />
                </Modal>
            </Card>
        )
    }
}
