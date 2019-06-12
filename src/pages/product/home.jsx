import React, { Component } from 'react'
import { 
  Card,
  Button,
  Table,
  Input,
  Select,
  Icon,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSeachProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/const'

const Option = Select.Option

export default class ProductHome extends Component {

  state = {
    loading: false,
    total: 0,
    products: [],
    seachType: 'productName', // 默认按名称搜索
    seachName: ''
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading: true})
    const { seachType, seachName } = this.state
    let result
    if (seachName) {
      // 搜索分页查询
      result = await reqSeachProducts({pageSize: PAGE_SIZE, pageNum, seachType, seachName})
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({loading: false})
    const { total, list } = result.data
    if (result.status === 0) {
      this.setState({
        total,
        products: list
      })
    }
  }

  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品状态成功！')
      this.getProducts(this.pageNum)
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => `￥${price}`
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const {status, _id} = product
          return (
            <span>
              <Button 
                type='primary'
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '以下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render() {
    const { products, total, loading, seachType, seachName } = this.state

    const title = (
      <span>
        <Select 
          value={seachType}
          onChange={value => this.setState({ seachType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
          placeholder='关键字' 
          style={{width: 150, margin: '0 15px'}}
          value={seachName}
          onChange={e => this.setState({ seachName: e.target.value })}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered
          loading={loading}
          rowKey='_id'
          dataSource={products} 
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            total,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
