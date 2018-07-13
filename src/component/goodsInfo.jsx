import React from 'react'
import { Table, Button, Row, Col, Input, Select } from 'antd'
// import getBackData from '../data'
//  引入connect组件
import {connect} from 'react-redux'
import {sagaTypes} from '../saga/sagaTable'
import {withRouter, Link} from 'react-router-dom'

const Option = Select.Option
let dispatch
let data
let option

class goodsInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      pageNum: 1,
      pageSize: 5
    }
  }
  componentDidMount () {
    dispatch = this.props.dispatch

    //  初始化数据
    dispatch({
      type: sagaTypes.INITGOODS,
      payload: {
        type: 'initGoodsInfo',
        pagination: {
          pageSize: 10,
          pageNum: 1
        },
        goodsInfo: true,
        valuePath: ['goodsInfoTable', 'data'],
        pagePath: ['goodsInfoTable', 'option']
      }
    })
  }
  render () {
    const {goodsInfoTable} = this.props
    data = goodsInfoTable.data
    option = goodsInfoTable.option
    let columns = [{
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text, record, index) => {
        return <span style={{color: '#2db7f5'}} >{text}</span>
      }
    }, {
      title: '介绍',
      dataIndex: 'description',
      key: 'address',
      width: 300
    }, {
      title: '评价',
      dataIndex: 'tips',
      key: 'tips',
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
    let tableProps = {
      columns: columns,
      dataSource: data.length ? data : [],
      pagination: {
        current: option && option.pageNum || 10,
        pageSize: option && option.pageSize || 1,
        total: option && option.total || 20,
        onChange: v => {
          dispatch({
            type: sagaTypes.PAGE_CHANGE,
            payload: {
            //  这里的type  依然可以使用sagaTypes去映射
              type: 'pageChange',
              pagination: {
                pageSize: option.pageSize,
                pageNum: v
              },
              goodsInfo: true,
              valuePath: ['goodsInfoTable', 'data'],
              pagePath: ['goodsInfoTable', 'option']
            }
          })
        }
      }
    }
    return (
      <div className='panel'>
        <h2>这是商品信息页</h2>
        <Row className='filter-row'>
          <Col span='3' className='filter-name'>
            <span>审核状态：</span>
          </Col>
          <Col span='4'>
            <Select
              value=''
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
            <Input value='' />
          </Col>

        </Row>
        <Row className='filter-row'>
          <Col offset='7'>
            <Button type='primary' onClick={(e) => {
              e.preventDefault()
            }}>查询</Button>
            <Button className='clear-button' onClick={this.clear}>清除条件</Button>
            <Link to='/'>Back</Link>
          </Col>
        </Row>
        <Table {...tableProps} className='commodityReview-table' />
      </div>

    )
  }
}

export default connect(state => ({
  goodsInfoTable: state.goodsInfoTable
}))(withRouter(goodsInfo))
