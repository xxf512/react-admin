import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { Redirect } from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'

import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storeUtils from '../../utils/storeUtils'

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        const {username, password} = values
        const res = await reqLogin(username, password)
        if (res.status === 0) {
          message.success('登录成功！')
          memoryUtils.user = res.data
          storeUtils.saveUser(res.data)
          this.props.history.replace('/')
        } else {
          message.error(res.msg)
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    // 判断是否登录
    if (memoryUtils.user && memoryUtils.user._id) {
      return <Redirect to='/' />
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo'></img>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', {
                  rules: [
                    { required: true, whitespace: true, message: '用户名不能为空！' },
                    { min: 4, message: '用户名至少4位！' },
                    { max: 12, message: '用户名最多12位！' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成！' }
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, whitespace: true, message: '密码不能为空！' },
                    { min: 4, message: '密码至少4位！' },
                    { max: 12, message: '密码最多12位！' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文、数字或下划线组成！' }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

const WrapLogin = Form.create()(Login)

export default WrapLogin


