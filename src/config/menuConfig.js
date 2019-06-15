import Home from '../pages/home/home'
import Category from '../pages/category/category'
import Product from '../pages/product/product'
import Role from '../pages/role/role'
import User from '../pages/user/user'
import Bar from '../pages/charts/bar'
import Line from '../pages/charts/line'
import Pie from '../pages/charts/pie'
// import memoryUtils from '../utils/memoryUtils'
// const {user} = memoryUtils
// console.log(memoryUtils ? memoryUtils.user : 'wer')
const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的 path
    icon: 'home', // 图标名称
    isPublic: true,  // 公共界面
    component: Home,
    auth: true
  },
  {
    title: '商品',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '品类管理',
        key: '/category',
        icon: 'bars',
        component: Category,
        // auth: menus.indexOf('/category') !== -1
      },
      {
        title: '商品管理',
        key: '/product',
        icon: 'tool',
        component: Product,
        // auth: menus.indexOf('/product') !== -1
      },
    ]
  },
  {
    title: '用户管理',
    key: '/user',
    icon: 'user',
    component: User,
    // auth: menus.indexOf('/user') !== -1
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'safety',
    component: Role,
    // auth: menus.indexOf('/role') !== -1
  },
  {
    title: '图形图表',
    key: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: '柱形图',
        key: '/charts/bar',
        icon: 'bar-chart',
        component: Bar,
        // auth: menus.indexOf('/charts/bar') !== -1
      },
      {
        title: '折线图',
        key: '/charts/line',
        icon: 'line-chart',
        component: Line,
        // auth: menus.indexOf('/charts/line') !== -1
      },
      {
        title: '饼图',
        key: '/charts/pie',
        icon: 'pie-chart',
        component: Pie,
        // auth: menus.indexOf('/charts/pie') !== -1
      },
    ]
  },
]
export default menuList