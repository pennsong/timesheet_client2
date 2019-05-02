import React from 'react'
import {Link, NavLink, Route} from "react-router-dom";
import {
    Layout, Menu, Breadcrumb, Icon, Button,
} from 'antd';
import * as PubSub from "pubsub-js";

import GongSi from "./GongSi";
import GongZuoJiLu from "./GongZuoJiLu";
import * as Event from '../../util/Event';
import XiangMu from "./XiangMu";
import YongHu from "./YongHu";

const {
    Header, Content, Footer, Sider,
} = Layout;

class Admin extends React.Component {
    render() {
        return (
            <Layout>
                <Sider>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        padding: '16px',
                        justifyContent: 'flex-start'
                    }}>
                        <NavLink exact activeClassName="active" to="/Admin/GongZuoJiLu">
                            <Icon type="pie-chart"/>
                            <span>工作记录</span>
                        </NavLink>
                        <NavLink exact activeClassName="active" to="/Admin/YongHu">
                            <Icon type="pie-chart"/>
                            <span>用户</span>
                        </NavLink>
                        <NavLink exact activeClassName="active" to="/Admin/GongSi">
                            <Icon type="pie-chart"/>
                            <span>公司</span>
                        </NavLink>
                        <NavLink exact activeClassName="active" to="/Admin/XiangMu">
                            <Icon type="pie-chart"/>
                            <span>项目</span>
                        </NavLink>
                        <Button type='dashed' ghost style={{marginTop: 'auto'}} onClick={() => {
                            PubSub.publish(Event.NEED_LOGIN)
                        }}>
                            退出
                        </Button>
                    </div>
                </Sider>
                <Layout style={{ display: 'flex'}}>
                    <Content style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                        <div style={{padding: '16px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Route path="/Admin/GongZuoJiLu" component={GongZuoJiLu}/>
                            <Route path="/Admin/YongHu" component={YongHu}/>
                            <Route path="/Admin/GongSi" component={GongSi}/>
                            <Route path="/Admin/XiangMu" component={XiangMu}/>
                        </div>
                    </Content>
                    <Footer>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            Timesheet ©2019 Created by UGEEZ
                        </div>
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Admin