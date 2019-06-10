import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

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