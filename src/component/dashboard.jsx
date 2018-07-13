import React from 'react'
import { Table, Button, Row, Col, Input, Select } from 'antd'
// import getBackData from '../data'
//  引入connect组件
import {connect} from 'react-redux'
import {sagaTypes} from '../saga/sagaTable'
import {withRouter, Link} from 'react-router-dom'

const Option = Select.Option
let data
let option

class dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skuId: '', // 商品ID
      upcName: '', // 商品名称
      upc: '', // 条形码
      reviewStatus: '', // 审核状态
      reviewType: '0', // 审核状态码
      total: 0, // 商品总数
      dataSource: [],
      pageNum: 1,
      pageSize: 5
    }
  }
  componentDidMount () {
    let dispatch = this.props.dispatch
    //  初始化数据
    dispatch({
      type: sagaTypes.INIT,
      payload: {
        //  这里的type  依然可以使用sagaTypes去映射
        type: 'firstInitDashBoard',
        pagination: {
          pageSize: this.state.pageSize,
          pageNum: this.state.pageNum
        },
        valuePath: ['table', 'data'],
        pagePath: ['table', 'option']
      }
    })
  }
  goGoodsInfo () {
    this.props.history.push('/goodsInfo')
  }
  render () {
    const {table} = this.props
    data = table.data
    option = table.option
    var columns = [{
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record, index) => {
        return <Link to='/goodsInfo' >{text}</Link>
      }
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 300
    }, {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100
    }, {
      title: '配送时间',
      dataIndex: 'order_lead_time',
      key: 'order_lead_time',
      width: 100
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100
    }]
    var tableProps = {
      columns: columns,
      dataSource: data.length ? data : [],
      pagination: {
        current: option && option.pageNum || 10,
        pageSize: option && option.pageSize || 1,
        total: option && option.total || 20,
        onChange: v => {
          this.props.dispatch({
            type: sagaTypes.PAGE_CHANGE,
            payload: {
              //  这里的type  依然可以使用sagaTypes去映射
              type: 'pageChange',
              pagination: {
                pageSize: this.state.pageSize,
                pageNum: v
              },
              valuePath: ['table', 'data'],
              pagePath: ['table', 'option']
            }
          })
        }
      }

    }
    return (
      <div className='panel'>
        <Row className='filter-row'>
          <Col span='3' className='filter-name'>
            <span>审核状态：</span>
          </Col>
          <Col span='4'>
            <Select
              value={this.state.reviewType}
              style={{width: '100%'}}>
              <Option key='0' value='0'>全部</Option>
              <Option key='1' value='1'>待审核</Option>
              <Option key='2' value='2'>已处理</Option>
              <Option key='3' value='3'>已驳回</Option>
            </Select>
          </Col>
          <Col span='3' className='filter-name'>
            <span>商品名称：</span>
          </Col>
          <Col span='4'>
            <Input value={this.state.upcName} />
          </Col>

        </Row>
        <Row className='filter-row'>
          <Col offset='7'>
            <Button type='primary' onClick={() => { this.queryData() }}>查询</Button>
            <Button className='clear-button' onClick={this.clear}>清除条件</Button>
          </Col>
        </Row>
        <Table {...tableProps} className='commodityReview-table' />
      </div>
    )
  }
}

export default connect(state => ({
  table: state.table
}))(withRouter(dashboard))
