import React, { Component } from 'react'
import {
  Card,
  Button,
  Icon,
  Table,
  message,
  Modal
} from 'antd'
import LinkButton from '../../components/link-button'
import AddFrom from './add-from'
import UpdateFrom from './update-from'

import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'

export default class Category extends Component {
  state = {
    categorys: [],
    loading: false,
    subCategorys: [], // 二级分类列表
    parentId: '0',
    categoryName: '' ,
    showStatus: 0
  }

  getCategorys = async (parentId) => {
    parentId = parentId || this.state.parentId
    this.setState({loading: true})
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      this.setState({loading: false})
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类信息失败！')
    }
  }

  showSubCategorys = (categorys) => {
    this.setState({
      parentId: categorys._id,
      categoryName: categorys.name
    }, () => {
      this.getCategorys()
    })
  }

  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
      categoryName: ''
    })
  }

  handleCancel = () => {
    // 清除表单数据
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  addCategory = () => {
    this.form.validateFields( async (err, values) => {
      if (!err) {
        const { parentId, categoryName } = values
        // 清除表单数据
        this.form.resetFields()
        // 关闭弹窗
        this.setState({
          showStatus: 0
        })
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0) {
          // 获取分类列表
          if (parentId === this.state.parentId) {
            this.getCategorys()        
          } else if (parentId === '0') {
            this.getCategorys('0')
          }
        }
      }
    })
  }

  showUpdate = (categorys) => {
    this.category = categorys
    this.setState({
      showStatus: 2
    })
  }

  updateCategory = async() => {
    this.form.validateFields( async (err, values) => {
      if (!err) {
        const categoryId = this.category._id
        const categoryName = values.categoryName
        // 清除表单数据
        this.form.resetFields()
        // 关闭弹窗
        this.setState({
          showStatus: 0
        })
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
          // 获取分类列表数据
          this.getCategorys()
        }
      }
    })
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (row) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(row)}>修改分类</LinkButton>
            { this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(row)}>查看子分类</LinkButton> : ''}
          </span>
        )
      }
    ]
  }
  // 为第一次render做准备
  componentWillMount() {
    this.initColumns()
  }
  // 发送请求
  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const { categorys, loading, parentId, categoryName, subCategorys, showStatus } = this.state
    const category = this.category || {}
    const title =  parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}></Icon>
        <span>{categoryName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )
    
    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered 
          loading={loading}
          pagination={{
            defaultPageSize: 5,
            showQuickJumper: true
          }}
          dataSource={ parentId === '0' ? categorys : subCategorys} 
          rowKey='_id'
          columns={this.columns} />

        <Modal
          title="添加分类"
          visible={ showStatus === 1 }
          okText='确定'
          cancelText='取消'
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddFrom 
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="更新分类"
          okText='确定'
          cancelText='取消'
          visible={ showStatus === 2 }
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateFrom 
           categoryName={category.name}
           setForm={(form) => this.form = form}
          />
        </Modal>

      </Card>
    )
  }
}
