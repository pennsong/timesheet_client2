import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";

const {Option} = Select;
const confirm = Modal.confirm;

class GongSi extends Component {
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
}

export default GongSi