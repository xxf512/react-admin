import React, { Component } from 'react'
import {
  Card,
  Input,
  Icon,
  Form,
  Button,
  Cascader,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import RichTextEditor from './rich-text-editor'
import PicturesWall from './pictures-wall'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
  state = {
    options: []
  }

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    // 初始化options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    const { product, isUpdate } = this
    const { pCategoryId } = product
    // 更新状态 且存在二级分类
    if (isUpdate && pCategoryId !== '0') {
      // 获取二级分类
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成对应的二级options
      const childrenOption = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到对应的一级options
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级options上面去
      targetOption.children = childrenOption
    }

    // 更新状态
    this.setState({options})
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys
      }
    }
  } 

  submit = () => {
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const { name, desc, price, categoryIds } = values
        let categoryId, pCategoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
        if (this.isUpdate) {
          product._id = this.product._id
        }
        const result = await reqAddOrUpdateProduct(product)
        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`)
        }
      }
    })
  }

  validatorPrice = (rule, value, callback) => {
    if (!value) {
      callback('必须输入商品价格！')
    } else if (value * 1 < 0) {
      callback('商品价格必须大于等于0！')
    } else {
      callback()
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0) {
      const childrenOption = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      targetOption.children = childrenOption
    } else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options],
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  componentWillMount () {
    // debugger
    const product = this.props.location.state
    this.isUpdate = !!product //是否是从更新按钮跳转过来的
    this.product = product || {}
  }

  render() {
    // debugger
    const { product, isUpdate } = this
    const { categoryId, pCategoryId, imgs, detail } = product
    const { getFieldDecorator } = this.props.form
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }
    const title = (
      <span>
        <LinkButton>
          <Icon 
            type='arrow-left' 
            style={{marginRight: 10}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [{ required: true, message: '必须输入商品名称!' }]
              })(<Input placeholder='请输入商品名称'></Input>)
            }
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [{ required: true, message: '必须输入商品描述!' }]
              })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, validator: this.validatorPrice },
                ]
              })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>)
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  { required: true, message: '必须指定商品分类!' },
                ]
              })(
                <Cascader
                  placeholder='请指定商品所属分类'
                  options={this.state.options}
                  loadData={this.loadData}
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)

