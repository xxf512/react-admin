import React, { Component } from 'react'
import { Modal } from 'antd'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import './index.less'
import { reqWeather } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils.js'
import storeUtils from '../../utils/storeUtils'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'

const confirm = Modal.confirm

class Header extends Component {
  state = {
    sysTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: '',
    currentCity: ''
  }
  getTime = () => {
    this.setIntervalId = setInterval(() => {
      const sysTime = formateDate(Date.now())
      this.setState({sysTime})
    }, 1000)
  }
  getTitle = () => {
    let path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }
  loginOut = () => {
    confirm({
      title: '退出登录',
      content: '确定退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 清除本地保存的user信息
        memoryUtils.user = {}
        storeUtils.removeUser()
        // 跳转到登录界面
        this.props.history.replace('/login')
      }
    })
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
  // 组件卸载前调用
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.setIntervalId)
  }

  render() {
    const { dayPictureUrl, weather, sysTime, currentCity } = this.state
    const userName = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{userName}</span>
          <LinkButton onClick={this.loginOut}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
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

export default withRouter(Header)