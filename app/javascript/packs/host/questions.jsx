import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Modal, Table, Form, Input, InputNumber } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Answers from './answers';

const QuestionsTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

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
        <Form.Item name={'title'} label="Title" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={'image_url'} label="Image URL" rules={[{ type: 'url' }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'points'} label="Points" rules={[{ required: true, type: 'number', min: 0 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name={'time'} label="Time (sec)" rules={[{ required: true, type: 'number', min: 5, max: 300 }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item name={'answer'} label="Answer" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
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
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Time (s)',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Sent',
      dataIndex: 'sent',
      key: 'sent',
      render: (_, record) => (
        <div>{record.sent_at ? "Yes" : "No"}</div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            shape="round"
            icon={<SendOutlined />}
            onClick={() => handleSendQuestion(record)}
          >
            Send
          </Button>
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
            Add question
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
