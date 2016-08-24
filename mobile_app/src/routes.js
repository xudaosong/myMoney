require('rk-toast/assets/index.less')
require('./styles/money.scss')

import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {Router, Route,IndexRoute, hashHistory} from 'react-router'

import StockList from './components/StockList'
import StockAdd from './components/StockAdd'
import StockOperation from './components/StockOperation'
import StockDetail from './components/StockDetail'
import MainContainer from './components/MainContainer'
import Home from './components/Home'

import RedTheme from './common/redTheme'

injectTapEventPlugin();

const AppRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        <Route path="stock" component={StockList}/>
        <Route path="/stock/add" component={StockAdd}/>
        <Route path="/stock/operation/:id" component={StockOperation}/>
        <Route path="/stock/detail/:id" component={StockDetail}/>
    </Router>
)

/*const AppRouter = (
 <Router history={hashHistory}>
 <Route path="/" component={MainContainer}>
 <IndexRoute component={StockList}/>
 <Route path="stock" component={StockList}/>
 <Route path="/stock/add" component={StockAdd}/>
 <Route path="/stock/operation" component={StockOperation}/>
 </Route>
 </Router>
 )*/

const muiTheme = getMuiTheme(RedTheme);

ReactDOM.render((
    <MuiThemeProvider muiTheme={muiTheme}>
        {AppRouter}
    </MuiThemeProvider>
), document.getElementById('root'));

