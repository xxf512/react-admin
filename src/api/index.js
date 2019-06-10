import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

const BASE = ''

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

 // 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
 // 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST')
 // 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')
// 获取天气的jsonp请求
export const reqWeather = (city) => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {}, (err, res) => {
      if (!err && res.status === 'success') {
        // 请求成功
        const {dayPictureUrl, weather} = res.results[0].weather_data[0]
        const {currentCity} = res.results[0]
        resolve({dayPictureUrl, weather, currentCity})
      } else {
        message.error('获取天气信息失败！')
      }
    })
  })
}