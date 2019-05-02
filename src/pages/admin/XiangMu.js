import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, message
} from 'antd';

import TablePage from "../../component/TablePage";
import * as InputType from "../../util/InputType";
import * as PPAxios from "../../util/PPAxios";
import * as GlobalValue from "../../util/GlobalValue";

const {Option} = Select;
const confirm = Modal.confirm;

class GongSi extends Component {
    tablePage = null;

    recordFormConfig = {
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
                <a href="javascript:;" onClick={() => this.tablePage.delete(record.id)}>Delete</a>
             </span>
            ),
        }],
    }

    componentWillMount() {
        // 取得公司列表
        PPAxios.httpPost(`${GlobalValue.RootUrl}admin/queryGongSi`, {})
            .then((response) => {
                const list = response.data.data;
                this.recordFormConfig.fields[0].options = list.map(item => ({
                    value: item.id,
                    text: item.mingCheng,
                }))
            })
    }

    render() {
        return (
            <div>
                <TablePage
                    ref={(ref) => this.tablePage = ref}
                    title='公司'
                    searchDataUrl={'admin/queryXiangMu'}
                    saveNewUrl={'admin/createXiangMu'}
                    deleteUrl={'admin/deleteXiangMu/'}
                    pageTitle={'项目'}
                    newText={'新建'}
                    recordFormConfig={this.recordFormConfig}
                    tableConfig={this.tableConfig}
                />
            </div>
        )
    }
}

export default GongSi