import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message, DatePicker, InputNumber,
} from 'antd';
import moment from 'moment';

import html2pdf from 'html2pdf.js';

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
        PubSub.subscribe(Event.REFRESH_GONGSI_JIESUANRI, () => {
            this.setGongSiList();
        });
        this.setGongSiList();
    }
    componentWillUnmount = () =>  {
        PubSub.unsubscribe(Event.REFRESH_GONGSI_JIESUANRI);
    }

    setGongSiList = () => {
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
                <WrappedSearchForm showExport={!!this.state.reportData} gongSiOptions={this.state.gongSiOptions} setReportData={this.setReportData} setGongSiList={this.setGongSiList} />
                {this.renderReport()}
            </div>
        )
    }

    renderReport() {
        if (this.state.reportData) {
            return (
                <div id="report" style={{background: '#fff', padding: '16px'}}>
                    {this.renderSection("开始")}
                    {this.renderSection("结束")}
                    {this.renderSection("期初Balance")}
                    {this.renderSection("期末Balance")}
                    {this.renderSection("项目汇总")}
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
        if (sectionName == "项目汇总") {
            return this.renderXiangMuHuiZongJiLu()
        }

        if (sectionName == "充值记录") {
            return this.renderChongZhiJiLu()
        }

        if (sectionName == "消费记录") {
            return this.renderXiaoFeiJiLu()
        }

        return null;
    }

    renderXiangMuHuiZongJiLu(){
        let total_haoshi = 0;
        let total_feiyong = 0;
        this.state.reportData.项目汇总.forEach(item => {
            total_haoshi += item.耗时;
            total_feiyong += item.费用;
        })

        return (
            <table className={'report'}>
                <thead>
                <tr>
                    <td><div>项目</div></td>
                    <td><div>耗时</div></td>
                    <td><div>费用</div></td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.项目汇总.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td><div>{item.项目}</div></td>
                                    <td><div>{toDecimal2(item.耗时)}</div></td>
                                    <td><div>{toDecimal2(item.费用)}</div></td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                <tr>
                    <td><div>合计</div></td>
                    <td><div>{toDecimal2(total_haoshi)}</div></td>
                    <td><div>{toDecimal2(total_feiyong)}</div></td>
                </tr>
                </tfoot>
            </table>

        )
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
                    <td><div>日期</div></td>
                    <td><div>金额</div></td>
                    <td><div>备注</div></td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.充值记录.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="date"><div>{item.日期}</div></td>
                                    <td><div>{item.金额}</div></td>
                                    <td className="comment"><div>{item.备注}</div></td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                    <tr>
                        <td><div>合计</div></td>
                        <td><div>{toDecimal2(total)}</div></td>
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
                    <td><div>日期</div></td>
                    <td><div>开始</div></td>
                    <td><div>结束</div></td>
                    <td><div>项目</div></td>
                    <td><div>人员</div></td>
                    <td><div>耗时</div></td>
                    <td><div>小时费用</div></td>
                    <td><div>费用</div></td>
                    <td><div>备注</div></td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.消费记录.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="date"><div>{moment(item.开始).format("YYYY-MM-DD")}</div></td>
                                    <td><div>{moment(item.开始).format("HH:mm")}</div></td>
                                    <td><div>{moment(item.结束).format("HH:mm") == "00:00" ? "24:00" : moment(item.结束).format("HH:mm")}</div></td>
                                    <td><div>{item.项目}</div></td>
                                    <td><div>{item.人员}</div></td>
                                    <td><div>{toDecimal2(item.耗时)}</div></td>
                                    <td><div>{item.小时费用}</div></td>
                                    <td><div>{toDecimal2(item.费用)}</div></td>
                                    <td className="comment"><div>{item.备注}</div></td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={7}><div>合计</div></td>
                    <td colSpan={2}><div>{toDecimal2(total)}</div></td>
                </tr>
                </tfoot>
            </table>

        )
    }
}

class SearchForm extends Component {

    submit = (setJieSuanRi) => {
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    gongSiId: values.gongSiId,
                    setJieSuanRi,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    kaiShi: moment(values.kaiShi._d).format('YYYY-MM-DD'),
                    jieShu: moment(values.jieShu._d).format('YYYY-MM-DD'),
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/generateBaoGao`, data)
                    .then((response) => {
                        this.props.setReportData(response.data.data);
                        if(setJieSuanRi){
                            PubSub.publish(Event.REFRESH_GONGSI_JIESUANRI);
                        }
                    });
            }
        });
    }

    exportToPDF = () => {
        let report = window.document.getElementById('report');
        let opt = {
            margin:       0.2,
            filename:     '工时费用清单.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf(report, opt);
    }

    renderOptions = () => {
        return this.props.gongSiOptions.map(item => (
            <Option value={item.value} key={item.value}>{item.text}</Option>
        ))
    }

    render = () => {
        const {form,showExport} = this.props;
        const {getFieldDecorator} = form;

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
                        {
                            showExport && 
                            <Button type="primary" style={{marginRight: '8px'}}
                                onClick={() => this.exportToPDF()}>导出PDF</Button>
                        }
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