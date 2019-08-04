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

class YongHuBaoGao extends Component {
    state = {
        yongHuOptions: [],
        reportData: null,
    }

    tableConfig = {
    }

    componentDidMount = () => {
        PubSub.subscribe(Event.REFRESH_YONGHU_JIESUANRI, () => {
            this.setYongHuList();
        });
        this.setYongHuList();
    }
    componentWillUnmount = () =>  {
        PubSub.unsubscribe(Event.REFRESH_YONGHU_JIESUANRI);
    }

    setYongHuList = () => {
        // 取得用户列表，非Admin    
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/queryYongHu`, {})
            .then((response) => {
                const list = response.data.data;
                this.setState({
                    yongHuOptions: list.filter(item => item.yongHuMing != 'Admin').map(item => ({
                        value: item.id,
                        text: item.yongHuMing + ":" + item.jieSuanRi
                    }))
                })
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
                <WrappedSearchForm showExport={!!this.state.reportData} yongHuOptions={this.state.yongHuOptions} setReportData={this.setReportData} setYongHuList={this.setYongHuList} />
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
                    {this.renderSection("提成记录")}
                    {this.renderSection("工作记录")}
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

        if (sectionName == "提成记录") {
            return this.renderTiChengJiLu()
        }

        if (sectionName == "工作记录") {
            return this.renderGongZuoJiLu()
        }

        return null;
    }

    renderXiangMuHuiZongJiLu() {
        let total_haoshi = 0;
        let total_shouru = 0;
        this.state.reportData.项目汇总.forEach(item => {
            total_haoshi += item.耗时;
            total_shouru += item.收入;
        })

        return (
            <table className={'report'}>
                <thead>
                <tr>
                    <td><div>公司</div></td>
                    <td><div>项目</div></td>
                    <td><div>耗时</div></td>
                    <td><div>收入</div></td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.项目汇总.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td><div>{item.公司}</div></td>
                                    <td><div>{item.项目}</div></td>
                                    <td><div>{toDecimal2(item.耗时)}</div></td>
                                    <td><div>{toDecimal2(item.收入)}</div></td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2}><div>合计</div></td>
                    <td><div>{toDecimal2(total_haoshi)}</div></td>
                    <td><div>{toDecimal2(total_shouru)}</div></td>
                </tr>
                </tfoot>
            </table>

        )
    }

    renderTiChengJiLu() {
        let total = 0;
        this.state.reportData.提成记录.forEach(item => {
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
                    this.state.reportData.提成记录.map(
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

    renderGongZuoJiLu() {
        let total = 0;

        this.state.reportData.工作记录.forEach(item =>{
            total += item.收入;
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
                    <td><div>小时提成</div></td>
                    <td><div>收入</div></td>
                    <td><div>备注</div></td>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.reportData.工作记录.map(
                        (item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="date"><div>{moment(item.开始).format("YYYY-MM-DD")}</div></td>
                                    <td><div>{moment(item.开始).format("HH:mm")}</div></td>
                                    <td><div>{moment(item.结束).format("HH:mm") == "00:00" ? "24:00" : moment(item.结束).format("HH:mm")}</div></td>
                                    <td><div>{item.项目}</div></td>
                                    <td><div>{item.人员}</div></td>
                                    <td><div>{toDecimal2(item.耗时)}</div></td>
                                    <td><div>{item.小时提成}</div></td>
                                    <td><div>{toDecimal2(item.收入)}</div></td>
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
                    yongHuId: values.yongHuId,
                    setJieSuanRi,
                    // 因为有时区的问题, 只能用以下方式强制转换成固定的字符串明确所选的日期
                    kaiShi: moment(values.kaiShi._d).format('YYYY-MM-DD'),
                    jieShu: moment(values.jieShu._d).format('YYYY-MM-DD'),
                }

                PPAxios.httpPost(`${GlobalValue.RootUrl}admin/generateYongHuBaoGao`, data)
                    .then((response) => {
                        this.props.setReportData(response.data.data);
                        if(setJieSuanRi) {
                            PubSub.publish(Event.REFRESH_YONGHU_JIESUANRI);
                        }
                    });
            }
        });
    }

    exportToPDF = () => {
        let report = window.document.getElementById('report');
        let opt = {
            margin:       0.2,
            filename:     '用户收支清单.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf(report, opt);
    }

    renderOptions = () => {
        return this.props.yongHuOptions.map(item => (
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
                            label="用户名称"
                        >
                            {getFieldDecorator('yongHuId', {
                                rules: [{required: true, message: '用户必填!'}],
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

export default YongHuBaoGao