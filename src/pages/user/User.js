import React, {Component} from 'react'
import {Link, NavLink, Route} from "react-router-dom";
import {
    Layout, Menu, Breadcrumb, Icon, Button, message, Form, Input, Row, Col, Modal,
} from 'antd';
import moment from 'moment';

import GongZuoJiLu from "./GongZuoJiLu";
import * as PubSub from "pubsub-js";
import * as Event from "../../util/Event";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";

const {
    Header, Content, Footer, Sider,
} = Layout;

class User extends React.Component {
    state = {
        editModalVisible: false,
    }

    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                {this.renderEditModal()}
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
                                <NavLink exact activeClassName="active" to="/User/GongZuoJiLu">
                                    <Icon type="file-text"/>
                                    <span>工作记录</span>
                                </NavLink>
                            </Menu.Item>
                        </Menu>
                        <Button type='dashed' ghost style={{marginTop: 'auto'}} onClick={() => {
                            this.openEditwModal();
                        }}>
                            修改密码
                        </Button>
                        <Button type='dashed' ghost style={{marginTop: '16px'}} onClick={() => {
                            PubSub.publish(Event.NEED_LOGIN)
                        }}>
                            退出
                        </Button>
                    </div>
                </Sider>
                <Layout>
                    <Content style={{margin: '16px 16px'}}>
                        <Route path="/User/GongZuoJiLu" component={GongZuoJiLu}/>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        Timesheet ©{moment().format('YYYY')} Created by {`${GlobalValue.COMPANY}`}
                    </Footer>
                </Layout>
            </Layout>
        )
    }

    openEditwModal = () => {
        this.setState({
            editModalVisible: true,
        })
    }

    closeEditModal = () => {
        this.setState({
            editModalVisible: false,
        })
    }

    renderEditModal() {
        return (
            <Modal visible={this.state.editModalVisible}
                   onCancel={this.closeEditModal}
                   title={'设置新密码'}
                   footer={null}
                   destroyOnClose={true}
            >
                {this.renderEditPage()}
            </Modal>
        )
    }

    renderEditPage = () => {
        return (
            <WrappedsetMiMaForm close={this.closeEditModal}/>
        )
    }
}

class setMiMaForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    password: values.password,
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}changePassword`, data)
                    .then(() => {
                        message.success("新密码设置成功.", 5)

                        this.props.close();
                    })
            }
        });
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item
                    label="新密码"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '新密码必填!'}]
                    })(
                        <Input/>
                    )}

                </Form.Item>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedsetMiMaForm = Form.create()(setMiMaForm);

export default User