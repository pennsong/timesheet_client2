import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message, DatePicker, InputNumber, Divider
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import moment from "./XiangMu";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";
import * as PubSub from "pubsub-js";
import * as Event from "../../util/Event";

const {Option} = Select;
const confirm = Modal.confirm;

class YongHu extends Component {
    state = {
        editModalVisible: false,
        yongHu: null,
    }

    tablePage = null;

    recordNewFormConfig = {
        fields: [
            {
                key: "yongHuMing",
                label: "用户名",
                type: InputType.INPUT,
                rules: [{required: true, message: '名称必填!'}]
            },
            {
                key: "miMa",
                label: "密码",
                type: InputType.INPUT,
                rules: [{required: true, message: '密码必填!'}]
            },
            {
                key: "xiaoShiFeiYong",
                label: "小时费用",
                type: InputType.INPUT,
                rules: [{required: true, message: '小时费用必填!'}]
            }
        ]
    }

    tableConfig = {
        column: [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '用户名',
            dataIndex: 'yongHuMing',
            key: 'yongHuMing',
        }, {
            title: '小时费用',
            dataIndex: 'xiaoShiFeiYong',
            key: 'xiaoShiFeiYong',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <span>
                     <a href="javascript:;" onClick={() => {
                         this.openEditwModal(record)
                     }}>新密码</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.tablePage.delete(record.id)}>删除</a>
             </span>
            ),
        }],
    }

    openEditwModal = (yongHu) => {
        this.setState({
            editModalVisible: true,
            yongHu,
        })
    }

    closeEditModal = () => {
        this.setState({
            editModalVisible: false,
        })
    }

    render() {
        return (
            <div>
                {this.renderEditModal()}
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='用户'
                    searchDataUrl={'admin/queryYongHu'}
                    saveNewUrl={'admin/createYongHu'}
                    deleteUrl={'admin/deleteYongHu/'}
                    pageTitle={'用户'}
                    newText={'新建'}
                    recordNewFormConfig={this.recordNewFormConfig}
                    tableConfig={this.tableConfig}
                />
            </div>
        )
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
        if (this.state.yongHu) {
            return (
                <WrappedsetMiMaForm yongHu={this.state.yongHu} close={this.closeEditModal}/>
            )
        } else {
            return null
        }
    }
}
class setMiMaForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    yongHuId: this.props.yongHu.id,
                    password: values.password,
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/setYongHuPassword`, data)
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

export default YongHu