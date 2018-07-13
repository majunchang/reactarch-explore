//  正常情况下  我们可以在reducer中  直接使用switch  标示不同的action
/*

  export default function counter (state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'INCREMENT_ASYNC':
      return state
    default:
      return state
  }
}

*/

/*
  在本项目中  当这种处理很多以后  我们再使用switch  反而不太好用
  参照与vuex中 声明mumation的方式  我们使用了reduxsauce插件   更好的标识不同的action

  同时  使用Immutable 插件
  1. 解决了 共享数据的可变状态
  2. 实现了时间旅行的功能 （对比与git提交）
  3. 只影响修改的节点和父节点  其他节点共享 节省了性能损耗

*/

import Immutable from 'seamless-immutable'

import {
  createReducer,
  createTypes
} from 'reduxsauce'

export const ReducerTypes = createTypes(

  `
  DEFAULT
  SET_IN
  `,
  {prefix: 'REDUCER_'}
)

//  声明初始化的state

const initialState = Immutable({
  table: {
    data: [],
    option: {}
  },
  list: {},
  goodsInfoTable: {
    data: [],
    option: {}
  }
})

export const defaultHandler = (state = initialState, action) => {
  return state
}

export const setIn = (state = initialState, action) => {
  const {payload} = action
  const {objPath, value} = payload
  return state.setIn(objPath, value)
}

export const handlers = {
  [ReducerTypes.SET_IN]: setIn,
  [ReducerTypes.DEFAULT]: defaultHandler
}

export default createReducer(initialState, handlers)
