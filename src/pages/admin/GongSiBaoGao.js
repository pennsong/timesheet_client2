import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message, DatePicker, InputNumber,
} from 'antd';
import moment from 'moment';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import * as PubSub from "pubsub-js";
import * as Event from "../../util/Event";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";
import {toDecimal2} from "../../util/Function";

const {Option} = Select;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

class GongSiBaoGao extends Component {
    state = {
        gongSiOptions: [],
        reportData: null,
    }

    tableConfig = {
        column: [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '公司名称',
            dataIndex: 'gongSiObjMingCheng',
            key: 'gongSiObjMingCheng',
        }, {
            title: '日期',
            dataIndex: 'riQi',
            key: 'riQi',
        }, {
            title: '金额',
            dataIndex: 'jinE',
            key: 'jinE',
        }, {
            title: '备注',
            dataIndex: 'beiZhu',
            key: 'beiZhu',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <span>
                <a href="javascript:;" onClick={() => this.tablePage.delete(record.id)}>删除</a>
             </span>
            ),
        }],
    }

    componentDidMount = () => {
        // 取得公司列表
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/queryGongSi`, {})
            .then((response) => {
                const list = response.data.data;
                this.setState({
                    gongSiOptions: list.map(item => ({
                        value: item.id,
                        text: item.mingCheng + ":" + item.jieSuanRi,
                    }))
                });
            })
    }

    setReportData = (reportData) => {
        this.setState({
            reportData,
        })
    }

    render() {
        return (
            <div>
                <WrappedSearchForm gongSiOptions={this.state.gongSiOptions} setReportData={this.setReportData}/>
                {this.renderReport()}
            </div>
        )
    }

    renderReport() {
        if (this.state.reportData) {
            return (
                <div style={{background: '#fff', padding: '16px'}}>
                    {this.renderSection("开始")}
                    {this.renderSection("结束")}
                    {this.renderSection("期初Balance")}
                    {this.renderSection("期末Balance")}
                    {this.renderSection("充值记录")}
                    {this.renderSection("消费记录")}
                    {/*<div>充值记录:</div>*/}
                    {/*{this.renderZhiFus(this.state.reportData.充值记录)}*/}
                    {/*<div>消费记录:</div>*/}
                    {/*{this.renderGongZuoJiLus(this.state.reportData.消费记录)}*/}
                </div>
            )
        } else {
            return null
        }
    }

    renderSection(sectionName) {
        return (
            <div>
                {this.renderSectionTitle(sectionName)}
                {this.renderSectionBody(sectionName)}
            </div>
        )
    }

    renderSectionTitle(sectionName) {
        return (
            <b>
                {`${sectionName}`}:
            </b>
        )
    }

    renderSectionBody(sectionName) {
        if (Array.isArray(this.state.reportData[sectionName])) {
            return this.renderArrayBody(sectionName);
        } else {
            return this.renderItemBody(sectionName);
        }
    }

    renderItemBody(sectionName) {
        if (sectionName.indexOf("Balance") != -1) {
            return (
                <span>
                    {toDecimal2(this.state.reportData[sectionName])}
                </span>
            )
        } else {
            return (
                <span>
                    {this.state.reportData[sectionName]}
                </span>
            )
        }
    }

    renderArrayBody(sectionName) {
        if (sectionName == "充值记录") {
            return this.renderChongZhiJiLu()
        }

        if (sectionName == "消费记录") {
            return this.renderXiaoFeiJiLu()
        }

        return null;
    }

    renderChongZhiJiLu() {
        let total = 0;
        this.state.reportData.充值记录.forEach(item => {
            total += item.金额
        })

        return (
            <table className={'report'}>
                <thead>
                <tr>
                    <td>日期</td>
                    <td>金额</td>
                    <td>备注</td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.充值记录.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.日期}</td>
                                    <td>{item.金额}</td>
                                    <td>{item.备注}</td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                    <tr>
                        <td>合计</td>
                        <td>{toDecimal2(total)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

        )
    }

    renderXiaoFeiJiLu() {
        let total = 0;

        this.state.reportData.消费记录.forEach(item =>{
            total += item.费用;
        })

        return (
            <table className={'report'}>
                <thead>
                <tr>
                    <td>日期</td>
                    <td>开始</td>
                    <td>结束</td>
                    <td>项目</td>
                    <td>人员</td>
                    <td>耗时</td>
                    <td>小时费用</td>
                    <td>费用</td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.消费记录.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{moment(item.开始).format("YYYY-MM-DD")}</td>
                                    <td>{moment(item.开始).format("HH:mm")}</td>
                                    <td>{moment(item.结束).format("HH:mm")}</td>
                                    <td>{item.项目}</td>
                                    <td>{item.人员}</td>
                                    <td>{toDecimal2(item.耗时)}</td>
                                    <td>{item.小时费用}</td>
                                    <td>{toDecimal2(item.费用)}</td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={7}>合计</td>
                    <td>{toDecimal2(total)}</td>
                </tr>
                </tfoot>
            </table>

        )
    }
}

class SearchForm extends Component {
    submit = (setJiSuanRi) => {
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                const data = {
                    gongSiId: values.gongSiId,
                    setJiSuanRi,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    kaiShi: moment(values.kaiShi._d).format('YYYY-MM-DD'),
                    jieShu: moment(values.jieShu._d).format('YYYY-MM-DD'),
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/generateBaoGao`, data)
                    .then((response) => {
                        console.log(response)
                        this.props.setReportData(response.data.data);
                    })
            }
        });
    }

    renderOptions = () => {
        return this.props.gongSiOptions.map(item => (
            <Option value={item.value} key={item.value}>{item.text}</Option>
        ))
    }

    render = () => {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            label="公司"
                        >
                            {getFieldDecorator('gongSiId', {
                                rules: [{required: true, message: '公司必填!'}],
                            })(<Select>
                                {this.renderOptions()}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="开始日期"
                        >
                            {getFieldDecorator('kaiShi', {
                                rules: [{required: true, message: '开始日期必填!'}],
                            })(
                                <DatePicker/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            label="结束日期"
                        >
                            {getFieldDecorator('jieShu', {
                                rules: [{required: true, message: '结束日期必填!'}],
                            })(
                                <DatePicker/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '42px'}}>
                        <Button type="primary" style={{marginRight: '8px'}}
                                onClick={() => this.submit(false)}>预览报告</Button>
                        <Button type="primary" onClick={() => this.submit(true)}>生成报告</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedSearchForm = Form.create()(SearchForm);

export default GongSiBaoGao