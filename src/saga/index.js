/*
  index.js中 接受的generate函数  原生写法  （官网提供写法）

import { put, call, take, fork } from 'redux-saga/effects'
import { takeEvery, takeLatest } from 'redux-saga'

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function * incrementAsync () {
  // 延迟 1s 在执行 + 1操作
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}

export default function * rootSaga () {
  // while(true){
  //   yield take('INCREMENT_ASYNC');
  //   yield fork(incrementAsync);
  // }

  // 下面的写法与上面的写法上等效
  yield * takeEvery('INCREMENT_ASYNC', incrementAsync)
}

*/

import sagatable from './sagaTable'

const combineSaga = (sagaObjs) => {
  let totalSagaArr = []
  Object.keys(sagaObjs).forEach(key => {
    let sagaSingleObj = sagaObjs[key]
    Object.keys(sagaSingleObj).forEach((index) => {
      //  这里一定要加一个括号 否则只是函数的声明  并不是函数的调用
      let item = sagaSingleObj[index]()
      totalSagaArr.push(item)
    })
  })
  return totalSagaArr
}

export default function * rootSaga () {
  yield combineSaga({sagatable})
}
