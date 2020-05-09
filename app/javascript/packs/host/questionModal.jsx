import React, { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const QuestionModal = ({
  initialQuestion,
  submit,
  cancel,
  visible,
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
      title={initialQuestion ? 'Edit question' : 'New question'}
      visible={visible}
      okText='Create'
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
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="image_url" label="Image URL" rules={[{ type: 'url' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="points" label="Points" rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="time" label="Time (sec)" rules={[{ required: true, type: 'number', min: 5, max: 300 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.List name="options">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Options' : ''}
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
                          message: "Please enter option or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Option" style={{ width: '60%' }} />
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
                    <PlusOutlined /> Add option
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

export default QuestionModal;