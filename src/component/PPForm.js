import {Component} from "react";
import {Button, Col, Form, Input, Row, Select} from "antd";
import React from "react";

import * as InputType from '../util/InputType'

const {Option} = Select;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 10},
};

const {TextArea} = Input;

class BaseForm extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.submit(values)
            }
        });
    }

    reset = () => {
        this.props.form.resetFields()
    }

    renderFormItem() {
        return this.props.formConfig.fields.map(item => {
            if (item.type == InputType.INPUT) {
                return this.renderInput(item);
            }

            if (item.type == InputType.SELECT) {
                return this.renderSelect(item);
            }

            if (item.type == InputType.TEXTAREA) {
                return this.renderTextArea(item);
            }

            console.error("未处理的InputType");
            return null
        });
    }

    renderOptions(options) {
        return options.map(item => (
            <Option value={item.value} key={item.value}>{item.text}</Option>
        ))
    }

    renderSelect(item) {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form.Item {...formItemLayout} {...item.formItemLayout} label={item.label} key={item.key}>
                {getFieldDecorator(item.key, {
                    rules: item.rules
                })(
                    <Select>
                        {
                            this.renderOptions(item.options)
                        }
                    </Select>
                )}
            </Form.Item>
        );
    }

    renderInput(item) {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form.Item {...formItemLayout} {...item.formItemLayout} label={item.label} key={item.key}>
                {getFieldDecorator(item.key, {
                    rules: item.rules
                })(<Input/>)}
            </Form.Item>
        );
    }

    renderTextArea(item) {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form.Item {...formItemLayout} {...item.formItemLayout} label={item.label} key={item.key}>
                {getFieldDecorator(item.key, {
                    rules: item.rules
                })(<TextArea rows={item.rows}/>)}
            </Form.Item>
        );
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form
                onSubmit={this.submit}
            >
                {
                    this.renderFormItem()
                }

                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button style={{marginLeft: 8}} onClick={this.reset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(BaseForm);