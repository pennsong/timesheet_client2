import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import {ppFormatDate, ppFormatTime} from "../../util/Function";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";

const {Option} = Select;
const confirm = Modal.confirm;

class GongZuoJiLu extends Component {
    tablePage = null;

    recordNewFormConfig = {
        fields: [
            {
                key: "importData",
                label: "导入数据",
                type: InputType.TEXTAREA,
                rows: 20,
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 20},
                },
                rules: [{required: true, message: '导入数据!'}]
            }
        ]
    }

    tableConfig = {
        column: [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '公司',
            dataIndex: 'gongSiObjMingCheng',
            key: 'gongSiObjMingCheng',
        }, {
            title: '项目',
            dataIndex: 'xiangMuObjMingCheng',
            key: 'xiangMuObjMingCheng',
        }, {
            title: '人员',
            dataIndex: 'yongHuObjYongHuMing',
            key: 'yongHuObjYongHuMing',
        }, {
            title: '开始',
            key: 'kaiShi',
            dataIndex: 'kaiShi',
        }, {
            title: '结束',
            key: 'jieShu',
            dataIndex: 'jieShu',
        }, , {
            title: '备注',
            key: 'beiZhu',
            dataIndex: 'beiZhu'
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

    processNewData = (values) => {
        const text = values.importData;
        const dataArray = text.split("\n").filter(item => item.trim().length > 0);
        const data = dataArray.map(item => {
            const fields = item.split(/\s+/);
            const date = ppFormatDate(fields[2]);
            const kaiShi = ppFormatTime(fields[3]);
            const jieShu = ppFormatTime(fields[4]);
            const beiZhu = item.substr(item.lastIndexOf(fields[4]) + fields[4].length).trim();

            return {
                xiangMuMingCheng: fields[0],
                yongHuMing: fields[1],
                kaiShi: date + "T" + kaiShi,
                jieShu: date + "T" + jieShu,
                beiZhu,
            }
        })

        return {data};
    }

    render() {
        return (
            <div>
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='工作记录'
                    searchDataUrl={'queryGongZuoJiLu'}
                    saveNewUrl={'importGongZuoJiLu'}
                    deleteUrl={'deleteGongZuoJiLu/'}
                    pageTitle={'工作记录'}
                    newText={'导入'}
                    recordNewFormConfig={this.recordNewFormConfig}
                    tableConfig={this.tableConfig}
                    processNewData={this.processNewData}
                />
            </div>
        )
    }
}

export default GongZuoJiLu