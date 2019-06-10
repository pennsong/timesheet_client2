import React, {Component} from 'react';

import {
    Form, Row, Col, Input, Button, Icon, Modal, Select, Table, message
} from 'antd';

import PPForm from "./PPForm";
import * as PPAxios from "../util/PPAxios";
import * as GlobalValue from "../util/GlobalValue";
import * as InputType from "../util/InputType";

const {Option} = Select;
const confirm = Modal.confirm;

class TablePage extends Component {
    state = {
        total: null,
        size: null,
        page: null,
        data: [],
        editData: null,
        newModalVisible: false,
        editModalVisible: false,
    }

    componentDidMount() {
        this.searchData(1, 10);
    }

    setData = (data) => {
        this.setState({data})
    }

    setPage = (page) => {
        this.setState({page})
    }

    setSize = (size) => {
        this.setState({size})
    }

    setTotal = (total) => {
        this.setState({total})
    }

    openNewModal = (e) => {
        e.preventDefault()
        this.setState({
            newModalVisible: true,
        });
    }

    closeNewModal = (e) => {
        this.setState({
            newModalVisible: false,
        });
    }

    openEditModal = (e, editData) => {
        e.preventDefault()
        this.setState({
            editModalVisible: true,
            editData: editData
        });
    }

    closeEditModal = (e) => {
        this.setState({
            editModalVisible: false,
        });
    }

    paginationOnChange = (page, size) => {
        this.searchData(page, size);
    }

    paginationOnShowSizeChange = (page, size) => {
        this.searchData(page, size);
    }

    // 新建保存
    saveNew = (values) => {
        if (this.props.processNewData) {
            try {
                values = this.props.processNewData(values);
            } catch (e) {
                message.error("数据解析错误!", 5);
                return;
            }
        }

        PPAxios.httpPost(`${GlobalValue.RootUrl}${this.props.saveNewUrl}`, values)
            .then((response) => {
                this.searchData();
                message.success("新建成功!");
                this.closeNewModal();
            })
            .catch((error) => {
            })
    }


    // 编辑保存
    saveEdit = (values) => {
        if (this.props.processEditData) {
            try {
                values = this.props.processEditData(values);
            } catch (e) {
                message.error("数据解析错误!", 5);
                return;
            }
        }

        PPAxios.httpPost(`${GlobalValue.RootUrl}${this.props.saveEditUrl}`, values)
            .then((response) => {
                this.searchData();
                message.success("修改成功!");
                this.closeEditModal();
            })
            .catch((error) => {
            })
    }

    // 删除
    delete = (id) => {
        confirm({
            title: '确认要删除么?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                PPAxios.httpDelete(`${GlobalValue.RootUrl}${this.props.deleteUrl}` + id)
                    .then(() => {
                        this.searchData();
                    })
                    .catch(() => {
                    })
            },
        });

    }

    // 查询
    searchData = (pageVal, sizeVal) => {
        const page = pageVal ? pageVal : this.state.page;
        const size = sizeVal ? sizeVal : this.state.size;

        PPAxios.httpPost(`${GlobalValue.RootUrl}${this.props.searchDataUrl}`,
            {
                size,
                // 服务器的page从0开始计数
                page: page - 1
            })
            .then((response) => {
                const {data} = response.data;
                const {page, size, totalPages, totalElements, empty} = response.data.ppPageInfo;

                if (empty == true && totalPages > 0) {
                    // 由于每页数量增加了, 页面减少导致目前是在最后一页显示空的数据, 或者由于删除导致当前页面为空, 需要重新抓取下
                    this.setState({page: totalPages});
                    this.searchData(totalPages, this.state.size)
                    return;
                }

                this.setData(data);
                // 页面的page从1开始计数
                this.setPage(page + 1);
                this.setSize(size);
                this.setTotal(totalElements);
            })
            .catch(() => {
                console.log("error");
            })
    }

    renderHeader() {
        return (
            <div style={{marginBottom: '16px'}}>
                <Row>
                    <Col span={2}>
                        <h3>{this.props.title}</h3>
                    </Col>
                    <Col span={2} push={20} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button type="primary" onClick={this.openNewModal}>{this.props.newText}</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    renderTable() {
        return (<Table columns={this.props.tableConfig.column}
                       rowKey="id"
                       dataSource={this.state.data}
                       style={{background: '#fff'}}
                       pagination={{
                           onChange: this.paginationOnChange,
                           onShowSizeChange: this.paginationOnShowSizeChange,
                           total: this.state.total,
                           pageSize: this.state.size,
                           showSizeChanger: true,
                           pageSizeOptions: ['10', '20', '30', '40', '50'],
                       }}
        />);
    }

    renderNewForm() {
        if (this.props.recordNewFormConfig) {
            return <PPForm formConfig={this.props.recordNewFormConfig} submit={this.saveNew}/>
        } else 
        {
            return null;
        }
    }

    renderEditForm() {
        if (this.props.recordEditFormConfig) {
            let editformConfig = Object.assign({}, this.props.recordEditFormConfig);
            if(this.state.editData) {
                editformConfig.fields.forEach(f => {
                    f.initialValue = this.state.editData[f.field || f.key];
                });
            }
            return <PPForm formConfig={editformConfig} submit={this.saveEdit}/>
        } else
        {
            return null;
        }
    }

    render() {
        return (
            <div>
                <Modal visible={this.state.newModalVisible}
                       onCancel={this.closeNewModal}
                       title={this.props.newText + this.props.title}
                       footer={null}
                       destroyOnClose={true}
                >
                    <div>
                        {this.renderNewForm()}
                    </div>
                </Modal>
                <Modal visible={this.state.editModalVisible}
                       onCancel={this.closeEditModal}
                       title={this.props.editText + this.props.title}
                       footer={null}
                       destroyOnClose={true}
                >
                    <div>
                        {this.renderEditForm()}
                    </div>
                </Modal>
                {this.renderHeader()}
                {this.renderTable()}
            </div>
        );
    }
}

export default TablePage