import React, { Component } from 'react'
import { Card, Select, Icon, Button, Table, Input, message } from "antd"
import LinkButton from "../../components/link-botton/linkBotton"
import { reqProduct, reqSearchProduct, reqUpdateProductStatus } from "../../api/index"
import { PAGE_SIZE } from "../../utils/constants"

const Option = Select.Option;
export default class ProductHome extends Component {


    state = {
        total: 0,
        loading: false,
        products: [],
        searchValue: "",
        searchType: "productName"
    }
    updateProductStatus = (productId,status) => {
       const result =  reqUpdateProductStatus(productId,status);
       if (result.status === 0) {
        message.success("更新商品状态成功");
        this.getProductList(this.pNo);
       }
    }
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => "￥" + price
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product;
                    return (<span>
                        <Button type="primary" onClick={() => this.updateProductStatus(_id, status === 1 ? 2 : 1)}>{status === 1 ? "下架" : "上架"}
                        </Button>
                        <span>{status === 1 ? "在售" : "已下架"}</span>
                    </span>)
                }

            },
            {
                title: '操作',
                width: 100,
                dataIndex: '',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push("/product/detail", { product })}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push("/product/addupdate",{product})} >修改</LinkButton>
                    </span>
                )

            }
        ];
    }

    componentDidMount() {
        this.getProductList();
    }
    componentWillMount() {
        //初始化列数据
        this.initColumns();
    }


    getProductList = async (pageNum) => {
        this.pNo = pageNum || 1;
        this.setState({ loading: true });
        const { searchType, searchValue } = this.state;
        let result;
        if (searchValue) {
            result = await reqSearchProduct({ pageNum:(pageNum||1), pageSize: PAGE_SIZE, searchValue, searchType })
            console.log(result);

        } else {
            result = await reqProduct(pageNum||1, PAGE_SIZE);
        }
        this.setState({ loading: false });
        if (result && result.status === 0) {
            const { total, list } = result.data;
            console.log("resule.data", list)
            this.setState({
                total,
                products: list
            })
        }
    }
    render() {
        const { products, total, loading, searchType, searchValue } = this.state;
        const title = (
            <span>
                <Select value={searchType} style={{ width: 120 }} onChange={value => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键词" style={{ width: 150, margin: "0 15px" }} onChange={event => this.setState({ searchValue: event.target.value })} value={searchValue}></Input>
                <Button type="primary" onClick={() => this.getProductList(1)}>搜索</Button>
            </span>

        );
        const extra = (
            <Button type="primary" onClick={() => this.props.history.push("/product/addupdate") }>
                <Icon type="plus"></Icon>
                添加商品
            </Button>
        );
        return (
            <Card title={title} extra={extra}>
                <Table bordered
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    rowKey="_id"
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total: total,
                        onChange: this.getProductList
                    }}
                />
            </Card>
        )
    }
}
