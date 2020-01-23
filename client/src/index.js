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

class Routing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={withRouter(Home)} />
          <Route path="/findPlayer" component={withRouter(FindPlayer)} />
          <Route path="/game" component={withRouter(Game)} />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Routing />, document.getElementById("root"));
registerServiceWorker();
