import React from 'react'
import {Link, NavLink, Route} from "react-router-dom";
import {
    Layout, Menu, Breadcrumb, Icon, Button,
} from 'antd';

import GongZuoJiLu from "./GongZuoJiLu";

const {
    Header, Content, Footer, Sider,
} = Layout;

class Admin extends React.Component {
    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        padding: '16px',
                        justifyContent: 'flex-start'
                    }}>
                        <NavLink exact activeClassName="active" to="/User/GongZuoJiLu">
                            <Icon type="pie-chart"/>
                            <span>工作记录</span>
                        </NavLink>
                        <Button type='dashed' ghost style={{marginTop: 'auto'}} onClick={this.logout}>
                            退出
                        </Button>
                    </div>
                </Sider>
                <Layout>
                    <Content style={{margin: '16px 16px'}}>
                        <Route path="/User/GongZuoJiLu" component={GongZuoJiLu} />
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        Timesheet ©2019 Created by UGEEZ
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Admin