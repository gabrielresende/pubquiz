import React, { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 6 },
  },
};

const QuestionModal = ({
  initialQuestion,
  submit,
  cancel,
  visible,
  intl,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // TODO: Fix this gambiarra
    if (initialQuestion) {
      form.resetFields();
    }
  }, [initialQuestion]);

  function handleSubmit() {
    form.validateFields()
    .then(values => submit({...initialQuestion, ...values}))
    .catch((e) => console.log('Something went wrong', e));
  }

  return (
    <Modal
      title={initialQuestion
        ? <FormattedMessage id="quiz.questions.editQuestionTitle" />
        : <FormattedMessage id="quiz.questions.newQuestionTitle" />}
      visible={visible}
      okText={initialQuestion
        ? <FormattedMessage id="quiz.questions.edit" />
        : <FormattedMessage id="quiz.questions.create" />}
      onOk={handleSubmit}
      onCancel={cancel}
      destroyOnClose
    >
      <Form
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        initialValues={initialQuestion}
      >
        <Form.Item name="title" label={<FormattedMessage id="quiz.questions.form.title" />} rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="image_url" label={<FormattedMessage id="quiz.questions.form.imageUrl" />} rules={[{ type: 'url' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="points" label={<FormattedMessage id="quiz.questions.form.points" />} rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="time" label={<FormattedMessage id="quiz.questions.form.time" />} rules={[{ required: true, type: 'number', min: 5, max: 300 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="answer" label={<FormattedMessage id="quiz.questions.form.answer" />} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.List name="options">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? <FormattedMessage id="quiz.questions.form.options" /> : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: <FormattedMessage id="quiz.questions.form.options.enterOrDeleteField" />,
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder={intl.formatMessage({ id: "quiz.questions.form.option" })} style={{ width: '60%' }} />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    style={{ width: '60%' }}
                  >
                    <PlusOutlined /> <FormattedMessage id="quiz.questions.form.addOption" />
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default injectIntl(QuestionModal);
