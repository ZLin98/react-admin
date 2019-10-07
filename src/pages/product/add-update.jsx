import React, { Component } from 'react'
import {
    Card,
    Form,
    Upload,
    Cascader,
    Input,
    Button,
    Icon,
    message
} from "antd"
import { reqGetCategoryList, reqAddOrUpdateProduct } from "../../api/index"
import PictureWall from "./picture-wall"
import RichTextEditor from "./rich-text-editor"

const { Item } = Form;
const { TextArea } = Input;
class AddOrUpdate extends Component {

    constructor() {
        super();
        this.pw = React.createRef();
        this.editor = React.createRef();
    }

    state = {
        options: []
    }

    componentDidMount() {
        this.getCategoryList("0");
    }
    componentWillMount() {
        const product = this.props.location.state;
        //!! 强制转换成boolean类型
        this.isUpdate = !!product;
        this.product = product || {};
    }
    getCategoryList = async (parentId) => {
        const result = await reqGetCategoryList(parentId);
        if (result.status === 0) {
            const categoryList = result.data;
            //一级分类列表
            if (parentId === "0") {
                categoryList && this.initOptions(categoryList)
            } else {
                //二级分类列表
                return categoryList;
            }
        }
    }

    initOptions = async (categoryList) => {
        //生成目标数组
        const options = categoryList.map(x => ({
            value: x._id,
            label: x.name,
            isLeaf: false
        }))

        const { isUpdate } = this;
        const { product } = this.product;
        const { pCategoryId, categoryId } = product;
        //有二级分类列表
        if (isUpdate && pCategoryId !== "0") {
            const subCategorys = await this.getCategoryList(pCategoryId);
            const childOptions = subCategorys.map(x => ({
                value: x._id,
                label: x.name,
                isLeaf: true
            }))
            //找到对应的一级分类的options
            const targetOption = options.find(x => x.value === pCategoryId);
            targetOption.children = childOptions;
        }
        //更新状态
        this.setState({ options: options })
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        //根据选中的一级分类列表，获取二级分类列表
        const subCategoryList = await this.getCategoryList(targetOption.value);
        targetOption.loading = false;
        if (subCategoryList && subCategoryList.length > 0) {
            const childOptions = subCategoryList.map(x => ({
                value: x._id,
                label: x.name,
                isLeaf: true
            }))
            targetOption.children = childOptions;
        } else {
            //当前分类没有二级分类
            targetOption.isLeaf = true;
        }
        this.setState({
            options: [...this.state.options],
        });
    };

    //价格验证
    validatorPrice = (rules, value, callback) => {
        if (value * 1 > 0) {
            callback();//验证通过；
        } else {

            callback("价格必须大于零");//验证没有通过
        }
    }

    sumbit = () => {
        //表单验证
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                //收集数据，发送请求，返回结果
                const { name, desc, price, category } = values;
                const imgs = this.pw.current.getImgs();
                const detail = this.editor.current.getDetail();
                let pCategoryId, categoryId;
                if (category.length === 1) {
                    pCategoryId = "0";
                    categoryId = category[0];
                } else {
                    pCategoryId = category[0];
                    categoryId = category[1];
                }
                const product = { name, desc, price, pCategoryId, categoryId, imgs, detail };
                //如果是更新，加入ID
                if (this.isUpdate) {
                    product._id = this.product.product._id;
                }

                const result = await reqAddOrUpdateProduct(product);
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? "更新" : "添加"}商品成功`);
                    this.props.history.goBack();
                } else {
                    message.error(`${this.isUpdate ? "更新" : "添加"}商品失败`);
                }
            }
        });
    }
    render() {
        const { isUpdate } = this;
        const { product } = this.product;
        const categoryIds = []
        if (isUpdate) {
            // 商品是一个一级分类的商品
            if (product.pCategoryId === '0') {
                categoryIds.push(product.categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(product.pCategoryId)
                categoryIds.push(product.categoryId)
            }
        }
        const title = (
            <span>
                <Icon type="arrow-left" style={{ color: "#1DA57A", marginRight: 15 }} onClick={() => this.props.history.goBack()} />
                <span>{isUpdate ? "修改商品" : "添加商品"}</span>
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator("name", {
                                initialValue: product.name,
                                rules: [{ required: true, message: "商品名称必须输入" }]
                            })(<Input placeholder="请输入商品名称" />)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator("desc", {
                                initialValue: product.desc,
                                rules: [{ required: true, message: "商品描述必须输入" }]
                            })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label="商品价格">
                        {
                            getFieldDecorator("price", {
                                initialValue: product.price,
                                rules: [{ required: true, message: "商品价格必须输入" }, {
                                    validator: this.validatorPrice
                                }]
                            })(<Input type="number" addonAfter="元" placeholder="请输入商品价格" />)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator("category", {
                                initialValue: categoryIds,
                                rules: [{ required: true, message: "商品分类必须选择" }]
                            })(<Cascader
                                placeholder="请选择商品分类"
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }

                    </Item>
                    <Item label="商品图片">
                        <PictureWall ref={this.pw} imgs={product.imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={product.detail} />
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.sumbit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(AddOrUpdate)
