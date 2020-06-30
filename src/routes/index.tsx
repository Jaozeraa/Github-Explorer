import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Repository from '../pages/Repository'

const Router: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/' component={Dashboard} exact />
            <Route path='/repositories/:repository+' component={Repository} />
        </Switch>
    </BrowserRouter>
)

export default Router