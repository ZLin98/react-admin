import React, { Component } from 'react'
import { List, Card, Icon } from "antd"
import {reqGetCategoryNameForId} from "../../api/index"
const Item = List.Item;
export default class Detail extends Component {
    state={
        categoryName:"",
        parentCategoryName:""
    }

    async componentDidMount () {
        const { pCategoryId,categoryId } = this.props.location.state.product;
        if (pCategoryId === "0") {
            const result = await reqGetCategoryNameForId(categoryId);
            this.setState({parentCategoryName:result.data&&result.data.name})
        }else {
            const results = await Promise.all([reqGetCategoryNameForId(pCategoryId),reqGetCategoryNameForId(categoryId)])
            const parentCategoryName = results[0]&&results[0].data&&results[0].data.name;
            const categoryName = results[1]&&results[1].data&&results[1].data.name;
            this.setState({parentCategoryName,categoryName});
        }
    }
    render() {
        const { product } = this.props.location.state;
        const {parentCategoryName,categoryName} = this.state;
        const title = (
            <span>
                <Icon type="arrow-left" style={{ color: "#1DA57A", marginRight: 15 }} onClick={() => this.props.history.goBack()} />
                <span>商品详情</span>
            </span>
        );
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格</span>
                        <span>{product.price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类</span>
                        <span>{parentCategoryName}{categoryName ? "-->" + categoryName : ""}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片</span>
                        {
                            product && product.imgs.map(x => {
                                return <img key={x} src={x} />
                            })
                        }
                    </Item>
                    <Item>
                        <span className="left">商品详情</span>
                        <span dangerouslySetInnerHTML={{ __html: product.detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
