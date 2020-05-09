import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Form, Input, InputNumber, Modal, Table, Tooltip } from 'antd';
import { EditOutlined, MinusCircleOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import Answers from './answers';

const QuestionsTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

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
  createQuestion,
  initialQuestion,
  handleCancel,
  visible,
}) => {
  const [form] = Form.useForm();
  
  function handleSubmit() {
    form.validateFields()
      .then(values => createQuestion(values))
      .catch(() => console.log('Something went wrong'));
  }

  return (
    <Modal
      title='New question'
      visible={visible}
      okText='Create'
      onOk={handleSubmit}
      onCancel={handleCancel}
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

const Questions = ({
  updateQuestions,
  closeQuestion,
  questions,
  players,
  sendQuestion,
  roundAnswers,
  registerAnswers,
}) => {
  const [customQuestion, setCustomQuestion] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [answersModalVisible, setAnswersModalVisible] = useState(false);
  const [question, setQuestion] = useState(undefined)

  function handleCreateQuestion(question) {
    updateQuestions({type: 'add', question});
    setModalVisible(false);
  }

  function handleSendQuestion(question) {
    const { answer, ...rawQuestion } = question;
    sendQuestion(rawQuestion);
    setQuestion({...question, sent_at: Date.now});
    setAnswersModalVisible(true);
    updateQuestions({type: 'edit', question: { ...question, sent_at: Date.now() }});
  }

  function handleCloseQuestion() {
    setQuestion(null);
    closeQuestion();
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: "60%",
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      width: "40%",
    },
    {
      title: 'Pts',
      dataIndex: 'points',
      key: 'points',
      width: 60,
    },
    {
      title: 't (s)',
      dataIndex: 'time',
      key: 'time',
      width: 60,
    },
    {
      title: 'Sent',
      dataIndex: 'sent',
      key: 'sent',
      width: 80,
      render: (_, record) => (
        <div>{record.sent_at ? "Yes" : "No"}</div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 120,
      render: (_, record) => (
        <div>
          <Tooltip title="Edit">
            <Button
              type="dashed"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleSendQuestion(record)}
            />
          </Tooltip>
          <span style={{ display: 'inline-block', width: '10px' }}></span>
          <Tooltip title="Send question">
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSendQuestion(record)}
            />
          </Tooltip>
        </div>
      ),
    }
  ];

  return (
    <div>
      <QuestionsTitle>
        <h3>Questions</h3>
        <div>
          <Button
            onClick={() => setModalVisible(true)}
          >
            New question
          </Button>
        </div>
      </QuestionsTitle>
      <Table
        dataSource={questions}
        columns={columns}
        rowKey={record => record.id}
      />
      <div>
        <input
          type="text"
          onChange={e => setCustomQuestion(e.target.value)}
        />
        <button
          onClick={() => handleSendQuestion({ id: 'open', title: customQuestion, time: 60 })}
        >
          Send question
        </button>
      </div>
      <QuestionModal
        visible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        createQuestion={handleCreateQuestion}
      />
      {answersModalVisible
        ? (
          <Answers
            visible={answersModalVisible}
            hideModal={() => setAnswersModalVisible(false)}
            question={question}
            players={players}
            roundAnswers={roundAnswers}
            registerAnswers={registerAnswers}
            closeQuestion={handleCloseQuestion}
          />
        )
        : null
      }
    </div>
  );
};

export default Questions;
