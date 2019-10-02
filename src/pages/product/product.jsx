import React, { Component } from 'react'
import { Switch, Route, Redirect} from "react-router-dom"
import ProductHome from "./product-home"
import Detail from "./detail"
import AddOrUpdate from "./add-update"
import "./product.less"


export default class Product extends Component {
    render() {
        return (
            <Switch>
                /** exact精准匹配*/
                <Route path="/product" exact component={ProductHome} />
                <Route path="/product/detail" component={Detail} />
                <Route path="/product/addupdate" component={AddOrUpdate} />
                <Redirect to="/product"/>
            </Switch>
        )
    }
}
