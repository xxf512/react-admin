import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddFrom extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentWillMount() {
    // 通过setForm讲from传递给父组件
    this.props.setForm(this.props.form)
  }

  render() {
    const { categorys, parentId } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categorys.map((c, index) => (
                    <Option value={c._id} key={index}>{c.name}</Option>
                  ))
                }
              </Select> 
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [{
                required: true, message: '请输入分类名称'
              }]
            })(
              <Input placeholder='请输入分类名称'></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddFrom)
