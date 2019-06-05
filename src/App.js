import React from 'react';
import {Button, Input, List} from 'antd'
import './App.css';
class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { items: [], text: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  render() {
    return (
      <div className="App">
        <h3>TODO</h3>
        <TodeList items={this.state.items}></TodeList>
        <form >
          <label htmlFor="new-todo">
            添加节点
          </label>
          <Input
            placeholder="添加节点"
            style={{width: 400,marginRight: 10}}
            onChange={this.handleChange}
            value={this.state.text}
          />
          <Button type="primary" onClick={this.handleSubmit}>
            Add #{this.state.items.length + 1}
          </Button>
        </form>
      </div>
    )
  }
  handleChange(e) {
    this.setState({ text: e.target.value })
  }
  handleSubmit(e) {
    // e.preventDefault()
    if (!this.state.text.length) {
      return;
    } 
    const newItem = {
      text: this.state.text,
      id: Date.now()
    }
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ''
    }))
  }
}

class TodeList extends React.Component {
  render() {
    return (
      // <ul>
      //   {
      //     this.props.items.map(item => (
      //       <li key={item.id}>{item.text}</li>
      //     ))
      //   }
      // </ul>
      <List
        style={{width: 400, marginBottom: 10, margin: 'auto'}}
        dataSource={this.props.items}
        renderItem={item => <List.Item>{item.text}</List.Item>}
      />
    )
  }
}

export default TodoApp ;
