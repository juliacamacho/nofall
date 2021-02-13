import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import DashboardPage from './pages/DashboardPage'
import VideosPage from './pages/VideosPage'
import AlertsPage from './pages/AlertsPage'

const routes = () => {
    return(
        <Switch>
            <Route exact path ="/">{<Redirect to="/dashboard" />}</Route>
            <Route path ="/alerts" component={AlertsPage}/>
            <Route path ="/videos" component={VideosPage}/>
            <Route path ="/dashboard" component={DashboardPage}/>
        </Switch>
    )
}

export default routes;