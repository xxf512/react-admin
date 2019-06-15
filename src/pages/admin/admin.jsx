import React, { PureComponent } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Layout, message } from 'antd'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import { Redirect, Route, Switch} from 'react-router-dom'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'
import Routers from '../../config/menuConfig'
const { Footer, Sider, Content } = Layout

export default class Admin extends PureComponent {
  
  initRouter = (route) => {
    const menus = memoryUtils.user.role.menus
    // console.log(route)
    return (
      route.map((item, index) => {
        return (
          item.children ? 
          this.initRouter(item.children) :
          <Route path={item.key} key={index} render={props => (
            menus.length > 0 ?
            ((menus.indexOf(item.key) !== -1 || item.auth) ? (<item.component {...props} />) : (message.error('无权限访问此功能！'), <Redirect to='/home' />)) : 
            (<item.component {...props} />)
          )}/>
        )
      })
    )
  }

  componentWillMount () {
    //  this.rounte = this.initRouter(Routers)
  }

  render() {
    const user = memoryUtils.user
    if (!user || !user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{backgroundColor: '#fff', margin: 20}}>
            <Switch>
              <Redirect exact from='/' to='/home' />
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/role' component={Role}/>
              <Route path='/user' component={User}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              {/* {
                this.rounte
              } */}
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳浏览体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
