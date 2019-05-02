import React, {Component} from 'react'
import {Button, Input, Layout, message, Modal, Table} from "antd";
import PubSub from "pubsub-js";

import * as PPAxios from "../../util/PPAxios";
import {
    ppFormatDate,
    ppFormatTime
} from "../../util/Function"

const {
    Header, Content, Footer,
} = Layout;

const {TextArea} = Input;

const columns = [{
    title: 'id',
    dataIndex: 'id',
    key: 'id',
}, {
    title: '公司',
    dataIndex: 'gongSi_mingCheng',
    key: 'gongSi_mingCheng',
}, {
    title: '项目',
    dataIndex: 'xiangMu_mingCheng',
    key: 'xiangMu_mingCheng',
}, {
    title: '人员',
    dataIndex: 'yongHu_yongHuMing',
    key: 'yongHu_yongHuMing',
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
}];

class GongZuoJiLu extends Component {
    state = {
        data: [],
        size: 10,
        page: 1,
        showModal: false,
        importData: ""
    }

    needLoginSub;

    logout = () => {
        // todo logout
        this.props.history.push(`/login`);
    }

    needLogin = () => {
        message.error('请登录!', 5);
        // this.props.history.push(`/login`);
    }

    componentDidMount() {
        // this.needLoginSub = PubSub.subscribe("NEED_LOGIN", this.needLogin);
        this.gainData();

    }

    gainData() {
        PPAxios.httpPost('http://localhost:8080/admin/queryGongZuoJiLu',
            {
                size: this.state.size,
                page: this.state.page - 1
            }
        )
            .then((response) => {
                const {content} = response.data.data;
                const {totalElements} = response.data.data;
                const {empty} = response.data.data;
                const {totalPages} = response.data.data;

                if (empty == true && totalPages > 0) {
                    // 由于每页数量增加了, 页面减少导致目前是在最后一页显示空的数据, 需要重新抓取下
                    console.log("current page:" + this.state.page);
                    this.setState({
                        page: totalPages
                    }, this.gainData())
                    return;
                }

                this.setState({
                    data: content,
                    totalElements
                });
            })
            .catch(() => {
            })
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.needLoginSub)
    }

    paginationOnChange = (page, pageSize) => {
        this.setState({
            page,
            size: pageSize
        }, () => {
            this.gainData();
        })

    }

    paginationOnShowSizeChange = (current, size) => {
        this.setState({
            size
        }, () => {
            this.gainData();
        })
    }

    showModal = () => {
        // this.setState({
        //     showModal: true,
        // });
        this.props.history.push("/Container/GongSi")
    }

    handleOk = (e) => {
        this.setState({
            showModal: false,
        });

        // 递交记录
        const text = this.state.importData;
        const dataArray = text.split("\n").filter(item => item.trim().length > 0);
        const data = dataArray.map(item => {
            const fields = item.split(/\s+/);
            const date = ppFormatDate(fields[2]);
            const kaiShi = ppFormatTime(fields[3]);
            const jieShu = ppFormatTime(fields[4]);

            return {
                xiangMuMingCheng: fields[0],
                yongHuMing: fields[1],
                kaiShi: date + "T" + kaiShi,
                jieShu: date + "T" + jieShu,
                beiZhu: fields[5]
            }
        })

        PPAxios.httpPost('http://localhost:8080/admin/importYongHuGongZuoJiLu',
            {
                data
            })
            .then((response) => {
                this.setState({importDataTextArea: ""});
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    handleCancel = (e) => {
        this.setState({
            showModal: false,
        });
    }

    importDataTextAreaOnChange = (e) => {
        this.state.importData = e.target.value;
    }

    render() {
        return (
            <Layout>
                <Layout style={{
                    display: "flex",
                    flexDirection: "column",
                    height: '100vh',
                    background: "#fff"
                }}>
                    <Header style={{
                        background: '#fff',
                        padding: '16px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <div style={{marginRight: "auto"}}>
                            <h3>工作记录</h3>
                        </div>
                        <div>
                            <Button type="primary" onClick={this.showModal}>
                                导入
                            </Button>
                        </div>
                    </Header>
                    <Content style={{margin: '24px 16px 0', flex: 1, overflow: "auto"}}>
                        <Modal
                            title="Basic Modal"
                            visible={this.state.showModal}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <TextArea rows={4} onChange={this.importDataTextAreaOnChange}/>
                        </Modal>
                        <Table columns={columns}
                               rowKey="id"
                               dataSource={this.state.data}
                               pagination={{
                                   onChange: this.paginationOnChange,
                                   onShowSizeChange: this.paginationOnShowSizeChange,
                                   total: this.state.totalElements,
                                   pageSize: this.state.size,
                                   showSizeChanger: true,
                                   pageSizeOptions: ['10', '20', '30', '40', '50'],
                               }}
                        />
                    </Content>
                    <Footer style={{textAlign: 'center', height: "50px"}}>
                        ©2019 Created by Ugeez
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default GongZuoJiLu;