import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message, DatePicker, Divider
} from 'antd';
import moment from 'moment';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";

const {Option} = Select;
const confirm = Modal.confirm;

class GongSi extends Component {
    state = {
        editModalVisible: false,
        gongSi: null,
    }

    tablePage = null;

    recordNewFormConfig = {
        fields: [
            {
                key: "mingCheng",
                label: "名称",
                type: InputType.INPUT,
                rules: [{required: true, message: '名称必填!'}]
            }
        ]
    }

    tableConfig = {
        column: [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '名称',
            dataIndex: 'mingCheng',
            key: 'mingCheng',
        }, {
            title: '结算日',
            dataIndex: 'jieSuanRi',
            key: 'jieSuanRi',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    <a href="javascript:;" onClick={() => {
                        this.openEditwModal(record)
                    }}>设置结算日</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.tablePage.delete(record.id)}>删除</a>
             </span>
            ),
        }],
    }

    openEditwModal = (gongSi) => {
        this.setState({
            editModalVisible: true,
            gongSi,
        })
    }

    closeAndRefreshList = () => {
        this.setState({
            editModalVisible: false,
        });
        this.tablePage.searchData();
    }


    render() {
        return (
            <div>
                {this.renderEditModal()}
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='公司'
                    searchDataUrl={'admin/queryGongSi'}
                    saveNewUrl={'admin/createGongSi'}
                    deleteUrl={'admin/deleteGongSi/'}
                    pageTitle={'公司'}
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
                   title={'设置新结算日'}
                   footer={null}
                   destroyOnClose={true}
            >
                {this.renderEditPage()}
            </Modal>
        )
    }

    renderEditPage = () => {
        if (this.state.gongSi) {
            return (
                <WrappedSetJieSuanRiForm gongSi={this.state.gongSi} closeAndRefreshList={this.closeAndRefreshList}/>
            )
        } else {
            return null
        }
    }
}

class setJieSuanRiForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    id: this.props.gongSi.id,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    jieSuanRi: moment(values.jieSuanRi._d).format('YYYY-MM-DD'),
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/setGongSiJieSuanRi`, data)
                    .then(() => {
                        message.success("结算日设置成功.", 5)

                        this.props.closeAndRefreshList();
                    })
            }
        });
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item
                    label="结算日"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('jieSuanRi', {
                        rules: [{required: true, message: '结算日必填!'}],
                    })(
                        <DatePicker/>
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

const WrappedSetJieSuanRiForm = Form.create()(setJieSuanRiForm);

export default GongSi