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
import ZhiFu from "./ZhiFu";
import GongSiBaoGao from "./GongSiBaoGao";

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
                        <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                        >
                            <Menu.Item key="1">
                                <NavLink exact activeClassName="active" to="/Admin/GongZuoJiLu">
                                    <Icon type="file-text"/>
                                    <span>工作记录</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <NavLink exact activeClassName="active" to="/Admin/YongHu">
                                    <Icon type="user"/>
                                    <span>用户</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <NavLink exact activeClassName="active" to="/Admin/GongSi">
                                    <Icon type="bank"/>
                                    <span>公司</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <NavLink exact activeClassName="active" to="/Admin/XiangMu">
                                    <Icon type="project"/>
                                    <span>项目</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <NavLink exact activeClassName="active" to="/Admin/ZhiFu">
                                    <Icon type="money-collect"/>
                                    <span>支付</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <NavLink exact activeClassName="active" to="/Admin/GongSiBaoGao">
                                    <Icon type="table"/>
                                    <span>公司报告</span>
                                </NavLink>
                            </Menu.Item>
                        </Menu>
                        <Button type='dashed' ghost style={{marginTop: 'auto'}} onClick={() => {
                            PubSub.publish(Event.NEED_LOGIN)
                        }}>
                            退出
                        </Button>
                    </div>
                </Sider>
                <Layout style={{display: 'flex'}}>
                    <Content style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                        <div style={{padding: '16px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Route path="/Admin/GongZuoJiLu" component={GongZuoJiLu}/>
                            <Route path="/Admin/YongHu" component={YongHu}/>
                            <Route path="/Admin/GongSi" component={GongSi}/>
                            <Route path="/Admin/XiangMu" component={XiangMu}/>
                            <Route path="/Admin/ZhiFu" component={ZhiFu}/>
                            <Route path="/Admin/GongSiBaoGao" component={GongSiBaoGao}/>
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