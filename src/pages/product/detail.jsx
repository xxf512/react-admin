import React, { Component } from 'react'
import {
  Card,
  List,
  Icon
} from 'antd'
import LinkButton from '../../components/link-button';
import { reqCategory } from '../../api'
import { BASE_UPLOAD_URL } from '../../utils/const'
 
const Item = List.Item


export default class ProductDetail extends Component {
  state = {
    cName1: '', // 一级分类名称
    cName2: '' // 二级分类名称
  }

  async componentDidMount () {
    const {pCategoryId, categoryId} = this.props.location.state.product
    if (pCategoryId === '0') {
      // 一级分类下的商品
      const rusult = await reqCategory(categoryId)
      const cName1 = rusult.data.name
      this.setState({cName1})
    } else {
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({cName1, cName2})
    }
  }

  render() {
    const { name, price, desc, detail, imgs } = this.props.location.state.product
    const { cName1, cName2 } = this.state
    const title = (
      <span>
        <LinkButton>
          <Icon 
            type='arrow-left' 
            style={{marginRight: 10}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>{cName1}{cName2 ? ` --> ${cName2} ` : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            <span>
              {
                imgs.map(img => (<img key={img} src={BASE_UPLOAD_URL + img} alt='img' className='product-img' />))
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: detail}}></span>
          </Item>
        </List>
        
      </Card>
    )
  }
}
