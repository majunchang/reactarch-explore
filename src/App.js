import React, { Component } from 'react'
import './App.css'
import dashboard from './component/dashboard'
import goodsInfo from './component/goodsInfo'
import {Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'

class App extends Component {
  render () {
    return (
      <div className='App' style={{padding: '100,100'}}>
        <div style={{marginTop: 100}} />
        <Switch>
          <Route path='/' exact component={dashboard} />
          <Route path='/goodsInfo' component={goodsInfo} />
        </Switch>
      </div>
    )
  }
}

export default connect(state => ({
  state
}))(App)
