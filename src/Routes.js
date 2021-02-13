import React from "react";
import { Switch, Route } from "react-router-dom";

import DashboardPage from './pages/DashboardPage'

const routes = () => {
    return(
        <Switch>
            <Route path ="/" component={DashboardPage}/>
        </Switch>
    )
}

export default routes;