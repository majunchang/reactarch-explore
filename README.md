##### github地址：https://github.com/majunchang/reactarch-explore

### 项目的引入背景

> 最近的项目中,遇到了一个项目，多个页面中存在多个表格，每一个表格都有相似的分页逻辑和不同的查询参数。 
>
> 如果采用传统的开发方式，mvc的架构不明确，页面（view）和逻辑层（controller）紧耦合，代码逻辑重复性工作较多，使用更改state的方式  去渲染页面，
>
> 如果遇到组件之间的传值，数据流通不明确，整体数据结构比较混乱

**项目简介**

1. 项目是一个简单的示例的demo
2. 本项目目的在于让更多的读者去了解这种模式，体会这种设计思想
3. 所有数据均为mock的假数据，仅供学习之用，不做任何商业用途。如果涉及版权问题，请及时告知

##### 项目的预览图

###### 表格一

![image](http://upload-images.jianshu.io/upload_images/5703029-9af6fb34fdc6546c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 表格二

![image](http://upload-images.jianshu.io/upload_images/5703029-0b06bd0a3026ca59.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 思考

1.  有没有一种方法，可以使项目的mvc层次更加明确，使项目的数据结构以及数据流程更加清晰明了。
2.  有没有一种方法，可以避免开发者进行重复的造轮子工作，相同的分页逻辑 传值查询功能等 能不能只写一次 从而能够让多个表格共用，且不会互相影响。

### 技术的选型

##### 项目主要使用了redux，react-redux，redux-saga，seamless-immutable，reduxsauce。建议读者可以先看一下这几个插件 否则直接看本项目 坡度会比较大

**越是用来解决具体问题的技术，使用起来越容易，越高效，学习成本越低；越是用来解决宽泛问题的技术，使用起来越难，学习成本越高。**

###### redux

- 三大原则：单一数据源，只读的state，使用纯函数来修改
- redux是一款 状态管理库，并且提供了react-redux来与react紧密结合，核心部分为Store，Action，Reducer。
- 数据流通的关系：通过Store中的这个对象提供的dispatch方法  =》 触发action=》改变State =》 导致其相关的组件 页面重新渲染 达到更新数据的效果
- 核心Api以及相关的功能源码分析 可以参考[我的这篇文章](https://www.jianshu.com/p/ebba5ff97b2d)

###### react-redux

- 提供一个Provider组件 负责吧外层的数据 传递给所有的子组件
- connect方法（高阶组件） 负责将props和dispatch的方法 传递给子组件

**redux-saga**

- *redux-saga* 是一个 redux 的中间件，而中间件的作用是为 redux 提供额外的功能。
- redux-saga 通过创建 Sagas 将所有的异步操作逻辑收集在一个地方集中处理，可以用来代替 redux-thunk 中间件。
- Sagas 可以被看作是在后台运行的进程，Sagas 监听发起的action，然后决定基于这个 action来做什么
- 在 redux-saga 的世界里，所有的任务都通用 yield Effects 来完成（Effect 可以看作是 redux-saga 的任务单元）。Effects 都是简单的 Javascript 对象，包含了要被 Saga middleware 执行的信息

> redux-saga 优缺点  redux-thunk优缺点 

- Sagas 不同于thunks，thunks 是在action被创建时调用，而 Sagas只会在应用启动时调用
- `redux-thunk`中间件可以让`action`创建函数先不返回一个`action`对象，而是返回一个函数，函数传递两个参数`(dispatch,getState)`,在函数体内进行业务逻辑的封装
- redux-thunk的缺点： action的形式不统一 ，异步操作太分散，分散在了各个action中
- **redux-saga**本质是一个可以自执行的generator。集中了所有的异步操作，
- 可以实现非阻塞异步调用，也可以使用非阻塞调用下的事件监听  [阻塞与非阻塞的概念](https://blog.csdn.net/QTFYING/article/details/72967620)
- 异步操作的流程可以人为手动控制流程

**seamless-immutable ** 

 关于immutable 可以用这两点来提现：持久化的数据结构和结构共享

详情可以参考[这篇文章](https://github.com/camsong/blog/issues/3)  在此不做赘述

npm地址以及api介绍：https://www.npmjs.com/package/seamless-immutable

**reduxsauce**

- 传统开发中reducer中区分不同的action  使用的是switch case的结构  针对每一个action的type进行判断  
- 使用reduxsauce之后  我认为 它和vuex判断mutation的type  有很大的相似之处  通过不同的类名来达到区分的目的 。

### 项目的搭建

#### **入口文件**

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

//  以上为项目原生引入文件    接下来 引入本次项目改造中 所需文件

//  引入 redux中的相关组件
import {createStore, applyMiddleware, compose} from 'redux'
import {HashRouter, withRouter} from 'react-router-dom'
//  引入reducer和saga中 相关文件
import reducers from './reducer'
import rootSaga from './saga'
//  引入saga中相关组件
import createSagaMiddleware from 'redux-saga'
//  引入react-redux相关组件  使redux和react 结合起来
import {Provider} from 'react-redux'

//  使用redux devtools  写法不止这一种
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducers, compose(
  composeEnhancers(applyMiddleware(sagaMiddleware))
))

//  动态执行sagas  必须在store创建好之后 才能执行这句代码 在store之前 执行 程序会报错
sagaMiddleware.run(rootSaga)

const AppWithRouter = withRouter(App)

ReactDOM.render(
  (<Provider store={store}>
    <HashRouter>
      <AppWithRouter />
    </HashRouter>
  </Provider>),
  document.getElementById('root')
)
registerServiceWorker()

```



#### redux-saga写法

```js
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

```



#### reducer写法

```js
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

```



#### 初始化加载数据(与分页时候的改变 逻辑相似 不再重复介绍

1. dashboard 文件中 的componentDidMount 钩子中dispatch（sagaTypes.INIT）

```js
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
```

1. 代码执行到saga文件夹中的sagaTable文件中的init方法 进而触发fetchData。 代码最后的put 执行到reducer中设置state中分页数据和每页的返回数据

```js
export function * init () {
  while (true) {
    const action = yield take(sagaTypes.INIT)
    const {payload} = action
    yield fork(fetchData, payload)
  }
}
function *fetchData(payload){
   // ....   页面主要逻辑省略
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

```

3  reducer中的table.js文件  通过setIn方法 （immutable语法） 改变state中的数据 进而更新dom

```js
export const setIn = (state = initialState, action) => {
  const {payload} = action
  const {objPath, value} = payload
  return state.setIn(objPath, value)
}
```

#### 项目数据结构

![image](http://upload-images.jianshu.io/upload_images/5703029-c85cfa8303dbbb69.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 参考文献

1. [React+Redux-Saga+Seamless-Immutable+Reduxsauce后台系统搭建之路](https://www.jianshu.com/p/4b2d6cb4a52b)     
2. [reduxsauce npm地址](https://www.npmjs.com/package/reduxsauce)
3. [redux-saga中文](https://redux-saga-in-chinese.js.org/)
4. [redux-saga框架使用详解及Demo教程]( https://www.jianshu.com/p/7cac18e8d870)
5. [Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)
6. [redux中文文档自述](http://www.redux.org.cn/)
