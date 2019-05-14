import React from 'react'
import {Link, NavLink, Route} from "react-router-dom";
import {
    Layout, Menu, Breadcrumb, Icon, Button,
} from 'antd';
import * as PubSub from "pubsub-js";
import moment from 'moment';

import GongSi from "./GongSi";
import GongZuoJiLu from "./GongZuoJiLu";
import * as Event from '../../util/Event';
import XiangMu from "./XiangMu";
import YongHu from "./YongHu";
import ZhiFu from "./ZhiFu";
import GongSiBaoGao from "./GongSiBaoGao";
import TiCheng from "./TiCheng";
import YongHuBaoGao from "./YongHuBaoGao"
import * as GlobalValue from "../../util/GlobalValue";

const {
    Header, Content, Footer, Sider,
} = Layout;

class Admin extends React.Component {
    state = {
        defaultMenuItemKey: '1'
    }
    componentWillMount() {
        let path = this.props.location.pathname.toLowerCase();
        let end = path.length;
        // 要求：path不能为 /Admin/xxxx 以外的格式
        for(let i = 7; i < path.length; i++) {
            if(path[i] == '/' || path[i] == '?' || path[i] == '#' || path[i] == '&') {
                end = i;
                break;
            }
        }
        path = path.substring(0, end);
        let path2key = {
            '/admin/gongzuojilu': '1',
            '/admin/yonghu': '2',
            '/admin/gongsi': '3',
            '/admin/xiangmu': '4',
            '/admin/zhifu': '5',
            '/admin/gongsibaogao': '6',
            '/admin/ticheng': '7',
            '/admin/yonghubaogao': '8',
        }
        this.setDefaultMenuItem(path2key[path] || '1');
    }
    setDefaultMenuItem(activeMenuItemKey) {
        this.setState({
            defaultMenuItemKey: activeMenuItemKey
        })
    }
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
                            defaultSelectedKeys={[this.state.defaultMenuItemKey]}
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
                            <Menu.Item key="7">
                                <NavLink exact activeClassName="active" to="/Admin/TiCheng">
                                    <Icon type="money-collect"/>
                                    <span>提成</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <NavLink exact activeClassName="active" to="/Admin/YongHuBaoGao">
                                    <Icon type="table"/>
                                    <span>用户报告</span>
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
                            <Route path="/Admin/TiCheng" component={TiCheng} />
                            <Route path="/Admin/YongHuBaoGao" component={YongHuBaoGao} />
                        </div>
                    </Content>
                    <Footer>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            Timesheet ©{moment().format('YYYY')} Created by {`${GlobalValue.COMPANY}`}
                        </div>
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Admin