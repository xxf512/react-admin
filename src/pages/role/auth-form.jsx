import React, { PureComponent } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuConfig from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree

export default class AuthFrom extends PureComponent {
  static propTypes = {
    role: PropTypes.object
  }

  constructor (props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }

  getTreeNode = (menuConfig) => {
    return menuConfig.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          { item.children ? this.getTreeNode(item.children) : null }
        </TreeNode>
      )
      return pre
    }, [])
  }

  getMenus = () => this.state.checkedKeys

  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }

  componentWillMount () {
    this.TreeNode = this.getTreeNode(menuConfig)
  }

  componentWillReceiveProps (nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state    
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          defaultExpandAll
        >
        <TreeNode title="平台权限" key="all">
          {
            this.TreeNode
          }
        </TreeNode>
      </Tree>
      </div>
    )
  }
}
