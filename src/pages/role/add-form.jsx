import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddFrom extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    // 通过setForm讲from传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [{
                required: true, message: '请输入角色名称'
              }]
            })(
              <Input placeholder='请输入角色名称'></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddFrom)
