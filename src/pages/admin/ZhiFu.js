import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";

const {Option} = Select;
const confirm = Modal.confirm;

class ZhiFu extends Component {
    tablePage = null;

    recordNewFormConfig = {
        fields: [
            {
                key: "gongSiMingCheng",
                label: "公司名称",
                type: InputType.INPUT,
                rules: [{required: true, message: '公司名称必填!'}]
            },
            {
                key: "riQi",
                label: "日期",
                type: InputType.INPUT,
                rules: [{required: true, message: '日期必填!'}]
            },
            {
                key: "jinE",
                label: "金额",
                type: InputType.INPUT,
                rules: [{required: true, message: '金额必填!'}]
            },
            {
                key: "beiZhu",
                label: "备注",
                type: InputType.INPUT,
                rules: []
            }
        ]
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

    render() {
        return (
            <div>
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='支付'
                    searchDataUrl={'admin/queryZhiFu'}
                    saveNewUrl={'admin/createZhiFu'}
                    deleteUrl={'admin/deleteZhiFu/'}
                    pageTitle={'支付'}
                    newText={'新建'}
                    recordNewFormConfig={this.recordNewFormConfig}
                    tableConfig={this.tableConfig}
                />
            </div>
        )
    }
}

export default ZhiFu