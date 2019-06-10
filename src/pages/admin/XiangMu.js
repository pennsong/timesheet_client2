import React, {Component} from 'react';
import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message, Divider, Tag, DatePicker, InputNumber
} from 'antd';
import * as PubSub from "pubsub-js";
import moment from 'moment';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";
import * as Event from "../../util/Event";

const {Option} = Select;
const confirm = Modal.confirm;

class XiangMu extends Component {
    state = {
        editModalVisible: false,
        xiangMu: null,
        yongHus: []
    }

    componentDidMount = () => {
        PubSub.subscribe(Event.REFRESH_EDITING_XIANGMU, () => {
            this.getXiangMu(this.state.xiangMu.id)
        })

        PubSub.subscribe(Event.REFRESH_XIANGMU_LIST, () => {
            this.tablePage.searchData();
        })

        // 取得公司列表
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/queryGongSi`, {})
            .then((response) => {
                const list = response.data.data;
                this.recordNewFormConfig.fields[0].options = list.map(item => ({
                    value: item.id,
                    text: item.mingCheng,
                }))
            })
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(Event.REFRESH_EDITING_XIANGMU);
        PubSub.unsubscribe(Event.REFRESH_XIANGMU_LIST);
    }

    tablePage = null;

    recordNewFormConfig = {
        fields: [
            {
                key: "gongSiId",
                label: "公司",
                type: InputType.SELECT,
                options: [],
                rules: [{required: true, message: '公司必填!'}]
            },
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
            title: '公司',
            dataIndex: 'gongSiObjMingCheng',
            key: 'gongSiObjMingCheng',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    <a href="javascript:;" onClick={() => {
                        this.edit(record.id)
                    }}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.tablePage.delete(record.id)}>删除</a>
                </span>
            ),
        }],
    }

    edit = (xiangMuId) => {
        this.getXiangMu(xiangMuId)
        this.getYongHu()
        this.openEditwModal()
    }

    getXiangMu = (id) => {
        PPAxios.httpGet(`${GlobalValue.RootUrl}admin/queryXiangMu/${id}`)
            .then((response) => {
                this.setState({
                    xiangMu: response.data.data
                })
            })
    }

    getYongHu = () => {
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/queryYongHu`, {})
            .then((response) => {
                this.setState({
                    yongHus: response.data.data
                })
            })
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

    renderEditPage = () => {
        if (this.state.xiangMu) {
            return (
                <div>
                    {this.renderSetMingChengForm()}
                    {this.renderAddChengYuanForm()}
                    {this.renderChengYuanList()}
                    {this.renderAddJiFeiBiaoZhunForm()}
                    {this.renderJiFeiBiaoZhunList()}
                    {this.renderAddTiChengBiaoZhunForm()}
                    {this.renderTiChengBiaoZhunList()}
                </div>
            )
        } else {
            return null
        }
    }

    renderSetMingChengForm = () => {
        return (
            <WrappedMingChengForm xiangMu={this.state.xiangMu}/>
        )
    }

    renderAddChengYuanForm = () => {
        // 从用户列表中取出非Admin的不在目前项目中的用户
        const options = this.state.yongHus.filter(item => {
            return !(this.state.xiangMu.jiFeiBiaoZhunRDtos.some(jiFeiBiaoZhunRDto => (
                jiFeiBiaoZhunRDto.yongHuObjId == item.id)
            )) && item.yongHuMing != 'Admin'
        });

        return (
            <WrappedAddChengYuanForm xiangMu={this.state.xiangMu} options={options}/>
        )
    }

    renderChengYuanList = () => {
        // render成员列表
        const options = this.state.yongHus.map(item => (
            <Option value={item.id} key={item.id}>{item.yongHuMing + ":" + item.xiaoShiFeiYong + "/" + item.xiaoShiTiCheng}</Option>
        ))

        // render项目成员标签
        const chengYuanArray = this.state.xiangMu.jiFeiBiaoZhunRDtos.map(
            item => ({
                id: item.yongHuObjId,
                yongHuMing: item.yongHuObjYongHuMing,
            })
        )

        const map = new Map();
        for (const item of chengYuanArray) {
            if (!map.has(item.id)) {
                map.set(item.id, item)
            }
        }

        return Array.from(map.values()).map(item => {
            return (
                <Tag key={item.id} closable onClose={(e) => {
                    e.preventDefault()
                    this.removeChengYuan(item.id)
                }}>{item.yongHuMing}</Tag>

            )
        })
    }

    removeChengYuan(yongHuId) {
        const data = {
            xiangMuId: this.state.xiangMu.id,
            yongHuId
        }
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/removeXiangMuChengYuan`, data)
            .then(() => {
                message.success("成员移除成功.", 5)
                PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
            })
    }

    renderAddJiFeiBiaoZhunForm = () => {
        // 从用户列表中取出在目前项目中的用户
        const options = this.state.yongHus.filter(item => {
            return (this.state.xiangMu.jiFeiBiaoZhunRDtos.some(jiFeiBiaoZhunRDto => (
                jiFeiBiaoZhunRDto.yongHuObjId == item.id)
            ))
        });

        return (
            <WrappedAddJiFeiBiaoZhunForm xiangMu={this.state.xiangMu} options={options}/>
        )
    }

    renderJiFeiBiaoZhunList = () => {
        return this.state.xiangMu.jiFeiBiaoZhunRDtos.map(item => {
            return (
                <div key={item.yongHuObjId + '_' + item.kaiShi}>
                    <Tag closable onClose={(e) => {
                        e.preventDefault()
                        this.removeJiFeiBiaoZhun(this.state.xiangMu.id, item.yongHuObjId, item.kaiShi)
                    }}>{`${item.yongHuObjYongHuMing} ${item.kaiShi} ${item.xiaoShiFeiYong}`}</Tag>
                </div>

            )
        })
    }

    removeJiFeiBiaoZhun(xiangMuId, yongHuId, kaiShi) {
        const data = {
            xiangMuId,
            yongHuId,
            kaiShi,
        }
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/removeXiangMuJiFeiBiaoZhun`, data)
            .then(() => {
                message.success("计费标准移除成功.", 5)
                PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
            })
    }

    renderAddTiChengBiaoZhunForm = () => {
        // 从用户列表中取出在目前项目中的用户
        const options = this.state.yongHus.filter(item => {
            return (this.state.xiangMu.tiChengBiaoZhunRDtos.some(tiChengBiaoZhunRDto => (
                tiChengBiaoZhunRDto.yongHuObjId == item.id)
            ))
        });

        return (
            <WrappedAddTiChengBiaoZhunForm xiangMu={this.state.xiangMu} options={options}/>
        )
    }

    renderTiChengBiaoZhunList = () => {
        return this.state.xiangMu.tiChengBiaoZhunRDtos.map(item => {
            return (
                <div key={item.yongHuObjId + '_' + item.kaiShi}>
                    <Tag closable onClose={(e) => {
                        e.preventDefault()
                        this.removeTiChengBiaoZhun(this.state.xiangMu.id, item.yongHuObjId, item.kaiShi)
                    }}>{`${item.yongHuObjYongHuMing} ${item.kaiShi} ${item.xiaoShiTiCheng}`}</Tag>
                </div>

            )
        })
    }

    removeTiChengBiaoZhun(xiangMuId, yongHuId, kaiShi) {
        const data = {
            xiangMuId,
            yongHuId,
            kaiShi,
        }
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/removeXiangMuTiChengBiaoZhun`, data)
            .then(() => {
                message.success("提成标准移除成功.", 5)
                PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
            })
    }

    renderEditModal() {
        return (
            <Modal visible={this.state.editModalVisible}
                   onCancel={this.closeEditModal}
                   title={'编辑项目'}
                   footer={null}
                   destroyOnClose={true}
            >
                {this.renderEditPage()}
            </Modal>
        )
    }

    render() {
        return (
            <div>
                {this.renderEditModal()}
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='项目'
                    searchDataUrl={'admin/queryXiangMu'}
                    saveNewUrl={'admin/createXiangMu'}
                    deleteUrl={'admin/deleteXiangMu/'}
                    pageTitle={'项目'}
                    newText={'新建'}
                    recordNewFormConfig={this.recordNewFormConfig}
                    tableConfig={this.tableConfig}
                />
            </div>
        )
    }
}

class MingChengForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    id: this.props.xiangMu.id,
                    mingCheng: values.mingCheng
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/setXiangMuMingCheng`, data)
                    .then(() => {
                        message.success("修改成功.", 5)
                        // 刷新项目列表
                        PubSub.publish(Event.REFRESH_XIANGMU_LIST);

                        // 刷新当前编辑项目
                        PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
                    })
            }
        });
    }

    reset = () => {
        this.props.form.resetFields()
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item label="名称" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                    {getFieldDecorator('mingCheng', {
                        initialValue: this.props.xiangMu.mingCheng,
                        rules: [{required: true, message: '名称必填!'}],
                    })(<Input/>)}
                </Form.Item>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft: 8}} onClick={this.reset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedMingChengForm = Form.create()(MingChengForm);

class AddChengYuanForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    xiangMuId: this.props.xiangMu.id,
                    yongHuId: values.yongHuId
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/addXiangMuChengYuan`, data)
                    .then(() => {
                        message.success("成员添加成功.", 5)

                        this.props.form.resetFields();

                        // 刷新当前编辑项目
                        PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
                    })
            }
        });
    }

    renderOptions = () => {
        return this.props.options.map(item => (
            <Option value={item.id} key={item.id}>{item.yongHuMing + ":" + item.xiaoShiFeiYong + "/" + item.xiaoShiTiCheng}</Option>
        ))
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item label="用户" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                    {getFieldDecorator('yongHuId', {
                        rules: [{required: true, message: '用户必填!'}],
                    })(<Select>
                        {this.renderOptions()}
                    </Select>)}
                </Form.Item>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">添加</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedAddChengYuanForm = Form.create()(AddChengYuanForm);

class AddJiFeiBiaoZhunForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    xiangMuId: this.props.xiangMu.id,
                    yongHuId: values.yongHuId,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    kaiShi: moment(values.kaiShi._d).format('YYYY-MM-DD'),
                    xiaoShiFeiYong: values.xiaoShiFeiYong,
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/addXiangMuJiFeiBiaoZhun`, data)
                    .then(() => {
                        message.success("计费标准添加成功.", 5)

                        this.props.form.resetFields();

                        // 刷新当前编辑项目
                        PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
                    })
            }
        });
    }

    renderOptions = () => {
        return this.props.options.map(item => (
            <Option value={item.id} key={item.id}>{item.yongHuMing}</Option>
        ))
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item label="成员" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                    {getFieldDecorator('yongHuId', {
                        rules: [{required: true, message: '成员必填!'}],
                    })(<Select>
                        {this.renderOptions()}
                    </Select>)}
                </Form.Item>
                <Form.Item
                    label="开始日期"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('kaiShi', {
                        rules: [{required: true, message: '开始日期必填!'}],
                    })(
                        <DatePicker/>
                    )}
                </Form.Item>
                <Form.Item
                    label="小时费用"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('xiaoShiFeiYong', {
                        rules: [{required: true, message: '小时费用必填!'}]
                    })(
                        <InputNumber min={0}/>
                    )}

                </Form.Item>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">添加</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedAddJiFeiBiaoZhunForm = Form.create()(AddJiFeiBiaoZhunForm);

class AddTiChengBiaoZhunForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    xiangMuId: this.props.xiangMu.id,
                    yongHuId: values.yongHuId,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    kaiShi: moment(values.kaiShi._d).format('YYYY-MM-DD'),
                    xiaoShiTiCheng: values.xiaoShiTiCheng,
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/addXiangMuTiChengBiaoZhun`, data)
                    .then(() => {
                        message.success("提成标准添加成功.", 5)

                        this.props.form.resetFields();

                        // 刷新当前编辑项目
                        PubSub.publish(Event.REFRESH_EDITING_XIANGMU)
                    })
            }
        });
    }

    renderOptions = () => {
        return this.props.options.map(item => (
            <Option value={item.id} key={item.id}>{item.yongHuMing}</Option>
        ))
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submit}>
                <Form.Item label="成员" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                    {getFieldDecorator('yongHuId', {
                        rules: [{required: true, message: '成员必填!'}],
                    })(<Select>
                        {this.renderOptions()}
                    </Select>)}
                </Form.Item>
                <Form.Item
                    label="开始日期"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('kaiShi', {
                        rules: [{required: true, message: '开始日期必填!'}],
                    })(
                        <DatePicker/>
                    )}
                </Form.Item>
                <Form.Item
                    label="小时提成"
                    labelCol={{span: 4}}
                    wrapperCol={{span: 10}}
                >
                    {getFieldDecorator('xiaoShiTiCheng', {
                        rules: [{required: true, message: '小时提成必填!'}]
                    })(
                        <InputNumber min={0}/>
                    )}

                </Form.Item>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">添加</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedAddTiChengBiaoZhunForm = Form.create()(AddTiChengBiaoZhunForm);

export default XiangMu