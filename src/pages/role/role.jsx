import React, { Component } from 'react'
import {
  Button,
  Card,
  Table,
  Modal,
  message
} from 'antd'
// import LinkButton from '../../components/link-button'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import user from '../../utils/memoryUtils'
import AddFrom from './add-form'
import AuthFrom from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import storeUtils from '../../utils/storeUtils.js'
import {PAGE_SIZE} from '../../utils/const'

export default class Role extends Component {
  state = {
    roles: [], 
    role: {}, // 当前选中的role
    loading: false,
    isShowAdd: false,
    isShowAuth: false
  }

  constructor (props) {
    super(props)
    this.auth = React.createRef()
  }

  getRoles = async () => {
    this.setState({loading: true})
    const result = await reqRoles()
    const roles = result.data
    this.setState({loading: false})
    if (result.status === 0) {
      this.setState({roles})
    }
  }

  addRole = () => {
    this.form.validateFields (async (err, values) => {
      if (!err) {
        const { roleName } = values
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功！')
          this.setState({
            isShowAdd: false
          })
          this.form.resetFields()
          this.getRoles()
        } else {
          message.error('添加角色失败！')
        }
      }
    })
  }

  addRoleAuth = async () => {
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.menus = menus
    Object.assign(role, {auth_name: user.user.username})
    const result = await reqUpdateRole(role)
    this.setState({
      isShowAuth: false
    })
    if (result.status === 0) {
      if (role._id === user.user.role_id) {
        user.user = {}
        storeUtils.removeUser()
        // 当前登录用户所属角色更新了，重新登录
        this.props.history.replace('/login')
        message.success('更新角色权限成功,请重新登录！')        
      } else {
        message.success('更新角色权限成功！')
        this.getRoles()
      }
    } else {
      message.error('更新角色权限失败！')
    }
  }

  onRow = (role) => {
    return {
      onClick: (even) => {
        this.setState({
          role
        })
      }
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (time) => formateDate(time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (time) => formateDate(time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, loading, isShowAuth } = this.state

    const title = (
      <span>
        <Button 
          type='primary' 
          onClick={() => this.setState({
            isShowAdd: true
          })}
        >创建角色
        </Button>&nbsp;&nbsp;
        <Button 
          type='primary' 
          onClick={() => this.setState({
            isShowAuth: true
          })}
          disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table 
          bordered
          loading={loading}
          rowKey='_id'
          dataSource={roles} 
          columns={this.columns}
          rowSelection={{
            type: 'radio', 
            selectedRowKeys: [role._id], 
            onSelect: (role) => {
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />

        <Modal
          title="添加分类"
          visible={ isShowAdd }
          okText='确定'
          cancelText='取消'
          onOk={this.addRole}
          onCancel={
            () => {
              this.setState({
              isShowAdd: false
            })
            this.form.resetFields()
          }}
        >
          <AddFrom 
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={ isShowAuth }
          okText='确定'
          cancelText='取消'
          onOk={this.addRoleAuth}
          onCancel={
            () => {
              this.setState({
              isShowAuth: false
            })
          }}
        >
          <AuthFrom 
            ref={this.auth}
            role={role}
          />
        </Modal>

      </Card>
    )
  }
}
