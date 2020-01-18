import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Home, FindPlayer, Game } from "./pages/Pages";
import registerServiceWorker from "./registerServiceWorker";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={withRouter(Home)} />
      <Route path="/findPlayer" component={withRouter(FindPlayer)} />
      <Route path="/game" component={withRouter(Game)} />
    </Switch>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
registerServiceWorker();
