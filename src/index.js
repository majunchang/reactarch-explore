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
