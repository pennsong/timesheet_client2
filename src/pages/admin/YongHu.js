import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";

const {Option} = Select;
const confirm = Modal.confirm;

class YongHu extends Component {
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
}

export default YongHu