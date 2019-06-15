import React, { PureComponent } from 'react'
import {
  Card,
  Table,
  Modal,
  Button,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import UserFrom from './user-form'
import { PAGE_SIZE } from '../../utils/const.js'
import { formateDate } from '../../utils/dateUtils'
import { reqUsers, reqDelUser, reqAddOrUpdateuser } from '../../api'
 
export default class User extends PureComponent {
  state = {
    users: [],
    user: {}, // 当前更新的user信息
    roles: [],
    isShow: false
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  initColumns = () => {
    this.columns = [
      {
        title:'用户名',
        dataIndex: 'username'
      },
      {
        title:'邮箱',
        dataIndex: 'email'
      },
      {
        title:'电话',
        dataIndex: 'phone'
      },
      {
        title:'注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title:'所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title:'操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.setState({isShow: true, user})}>修改</LinkButton>
            <LinkButton onClick={() => this.delUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  addOrUpdateUser = () => {
    this.form.validateFields (async (err, values) => {
      if (!err) {
        // console.log(values)
        if (this.state.user._id) {
          values._id = this.state.user._id
        }
        const result = await reqAddOrUpdateuser(values)
        if(result.status === 0) {
          message.success(`${this.state.user._id ? '更新' : '添加'}用户成功！`)
          this.setState({isShow: false})
          this.form.resetFields()
          this.getUsers()
        } else {
          message.error('添加用户失败！')
        }
      }
    })
  }

  delUser = (user) => {
    Modal.confirm({
      title: '删除用户',
      content: `确定删除${user.username}用户吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDelUser(user._id)
        if(result.status === 0) {
          message.success('删除成功！')
          this.getUsers()
        } else {
          message.error('删除失败！')
        }
      }
    })
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }

  render() {
    const { users, isShow, roles, user } = this.state
    const title = <Button type='primary' onClick={() => this.setState({isShow: true, user: {}})}>创建用户</Button>

    return (
      <Card title={title}>
        <Table 
          bordered
          rowKey='_id'
          dataSource={users} 
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={ isShow }
          okText='确定'
          cancelText='取消'
          onOk={this.addOrUpdateUser}
          onCancel={
            () => {
              this.setState({
                isShow: false
            })
            this.form.resetFields()
          }}
        >
          <UserFrom 
            roles={roles}
            user={user}
            setForm={(form) => this.form = form}
          />
        </Modal>
      </Card>
    )
  }
}
