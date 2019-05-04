import React, {Component} from 'react';
import axios from 'axios';

import * as PPAxios from '../../util/PPAxios';
import {RootUrl} from '../../util/GlobalValue'

import {
    Form, Icon, Input, Button, Checkbox, message,
} from 'antd';

import '../../App.css';

class LoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    username: values.username,
                    password: values.password
                };

                PPAxios.httpPost(`${RootUrl}login`, data)
                    .then((response) => {
                        // 存储jwt
                        localStorage.setItem('jwt', response.data.data);

                        // 根据用户名跳转到对应首页
                        if (values.username === 'Admin') {
                            this.props.history.push(`/Admin/GongZuoJiLu`);
                        } else {
                            this.props.history.push(`/User/GongZuoJiLu`);
                        }
                    })
                    .catch(() => {
                    });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Username"/>
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Please input your Password!'}],
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                   placeholder="Password"/>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedLoginForm = Form.create({name: 'normal_login'})(LoginForm);

export default WrappedLoginForm;

