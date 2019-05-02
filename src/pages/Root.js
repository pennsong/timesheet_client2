import React, {Component} from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import * as PubSub from "pubsub-js";

import * as Event from "../util/Event"
import Login from "./login/Login";
import Admin from "./admin/Admin";
import User from "./user/User";

class Root extends Component {
    logout = () => {
        this.props.history.push(`/Login`);
        localStorage.clear();
    }

    componentDidMount() {
        PubSub.subscribe(Event.NEED_LOGIN, this.logout);
    }

    componentWillUnmount() {
        PubSub.clearAllSubscriptions();
    }

    render() {
        return (
            <div>
                <Route path="/Login" component={Login}/>
                <Route path="/Admin" component={Admin}/>
                <Route path="/User" component={User}/>
            </div>
        );
    }
}

export default Root;