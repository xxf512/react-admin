import React, { Component } from 'react'
import './index.less'
import { reqWeather } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils.js'
import { formateDate } from '../../utils/dateUtils'

export default class Header extends Component {
  state = {
    sysTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: '',
    currentCity: ''
  }
  getTime = () => {
    setInterval(() => {
      const sysTime = formateDate(Date.now())
      this.setState({sysTime})
    }, 1000)
  }
  getWeathInfo = async () => {
    const { dayPictureUrl, weather, currentCity } = await reqWeather('长沙')
    this.setState({
      dayPictureUrl,
      weather,
      currentCity
    })
  }

  async componentWillMount() {
    this.getWeathInfo()
    this.getTime()
  }

  render() {
    const { dayPictureUrl, weather, sysTime, currentCity } = this.state
    const userName = memoryUtils.user.username
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{userName}</span>
          <a href="www.baidu.com">退出</a>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            首页
          </div>
          <div className='header-bottom-right'>
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt={weather}/>
            <span>{currentCity}：{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
