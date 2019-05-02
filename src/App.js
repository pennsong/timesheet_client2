import React, {Component} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

import NotFound from "./pages/NotFound";
import Root from "./pages/Root";

class App extends Component{
  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route path="/" component={Root}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
