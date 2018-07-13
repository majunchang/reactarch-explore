
//  引入 redux-saga中  引入effect
import {call, put, take, fork, takeEvery, select} from 'redux-saga/effects'
import {ReducerTypes} from '../reducer/table'
import {createTypes} from 'reduxsauce'
//  引入首页信息数据  和 商品信息数据
import { getBackData, getGoodsInfo } from '../data'

const tableData = getBackData().map((item, index) => {
  item.key = item.phone
  return item
})

const goodsInfoTableData = getGoodsInfo().map((item, index) => {
  item.key = item.item_id
  return item
})

export const sagaTypes = createTypes(

  `
   PAGE_CHANGE
   INIT
   INITGOODS
  `,
  {prefix: 'SAGA_'}
)

function * fetchData (payload) {
  let initalPagination = {
    pageSize: 5,
    pageNum: 1
  }
  // 从外部数据 传入的分页数据 和 表明谁调用的type
  const {type, pagination, goodsInfo, valuePath, pagePath} = payload
  if (type) {
    initalPagination.pageSize = pagination.pageSize
    initalPagination.pageNum = pagination.pageNum
  }

  let returnTableData = []
  let total

  //  判断一下 是dashboard需要的表格数据   还是goodsInfo需要的表格数据
  if (goodsInfo) {
    let length = Math.min(initalPagination.pageSize, goodsInfoTableData.length - ((initalPagination.pageNum - 1) * initalPagination.pageSize))
    for (let i = 1; i < length + 1; i++) {
      let index = (initalPagination.pageNum - 1) * initalPagination.pageSize + i - 1
      returnTableData.push(goodsInfoTableData[index])
    }
    total = goodsInfoTableData.length
  } else {
  //  根据页码 选出数据 然后进行返回
    let length = Math.min(initalPagination.pageSize, tableData.length - (initalPagination.pageNum - 1) * initalPagination.pageSize)
    for (let i = 1; i < length + 1; i++) {
      let index = (initalPagination.pageNum - 1) * initalPagination.pageSize + i - 1
      returnTableData.push(tableData[index])
    }
    total = tableData.length
  }
  const paginationOption = {
    pageSize: initalPagination.pageSize,
    pageNum: initalPagination.pageNum,
    total: total
  }
  yield put({
    type: ReducerTypes.SET_IN,
    payload: {
      objPath: valuePath,
      value: returnTableData
    }
  })
  yield put({
    type: ReducerTypes.SET_IN,
    payload: {
      objPath: pagePath,
      value: paginationOption
    }
  })
}

export function * pageChange () {
  while (true) {
    const action = yield take(sagaTypes.PAGE_CHANGE)
    // 取出action中的载荷
    const {payload} = action
    yield fork(fetchData, payload)
  }
}

export function * init () {
  while (true) {
    const action = yield take(sagaTypes.INIT)
    const {payload} = action
    yield fork(fetchData, payload)
  }
}

export function * initGoods () {
  while (true) {
    const action = yield take(sagaTypes.INITGOODS)
    const {payload} = action
    yield fork(fetchData, payload)
  }
}

export default {
  pageChange,
  init,
  initGoods
}
