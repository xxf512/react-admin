import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import ProductHome from './home'

import './product.less'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' exact component={ProductHome}></Route>
        <Route path='/product/detail' component={ProductDetail}></Route>
        <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
