import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {

  getOption = () => {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data:['销量']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
  }

  render() {
    return (
      <Card title={<Button type='primary'>折线图</Button>}>
        <ReactEcharts option={this.getOption()}></ReactEcharts>
      </Card>
    )
  }
}
