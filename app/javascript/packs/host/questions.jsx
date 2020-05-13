import React, { useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Modal, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import Round from './round';
import QuestionModal from './questionModal';

const QuestionsTitle = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

const Questions = ({
  updateQuestions,
  closeQuestion,
  intl,
  questions,
  players,
  sendQuestion,
  roundAnswers,
  registerAnswers,
}) => {
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [roundModalVisible, setRoundModalVisible] = useState(false);
  const [question, setQuestion] = useState(undefined)

  function handleNewQuestion() {
    setQuestion({});
    setQuestionModalVisible(true);
  }

  function handleEditQuestion(questionData) {
    setQuestion(questionData);
    setQuestionModalVisible(true);
  }

  function handleDeleteQuestion(questionData) {
    Modal.confirm({
      title: intl.formatMessage({ id: 'quiz.questions.confirmDeleteQuestionTitle' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'quiz.questions.confirmDeleteQuestionMessage' }),
      onOk() {
        updateQuestions({ type: 'delete', question: questionData });
      },
    });
  }

  function handleSubmitQuestion(questionData) {
    const type = questionData.id ? 'edit' : 'add';
    updateQuestions({ type, question: questionData });
    setQuestionModalVisible(false);
    setQuestion(null);
  }

  function handleSendQuestion(question) {
    const { answer, ...rawQuestion } = question;
    sendQuestion(rawQuestion);
    setQuestion({...question, sent_at: Date.now});
    setRoundModalVisible(true);
    updateQuestions({type: 'edit', question: { ...question, sent_at: Date.now() }});
  }

  function handleCloseQuestion() {
    setQuestion(null);
    closeQuestion();
  }

  const columns = [
    {
      title: <FormattedMessage id="quiz.questions.table.title" />,
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: "60%",
    },
    {
      title: <FormattedMessage id="quiz.questions.table.answer" />,
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      width: "40%",
    },
    {
      title: <FormattedMessage id="quiz.questions.table.points" />,
      dataIndex: 'points',
      key: 'points',
      width: 60,
    },
    {
      title: <FormattedMessage id="quiz.questions.table.time" />,
      dataIndex: 'time',
      key: 'time',
      width: 60,
    },
    {
      title: <FormattedMessage id="quiz.questions.table.sent" />,
      dataIndex: 'sent',
      key: 'sent',
      width: 80,
      render: (_, record) => (
        <div>{record.sent_at ? "Yes" : "No"}</div>
      ),
    },
    {
      title: <FormattedMessage id="quiz.questions.table.actions" />,
      dataIndex: 'actions',
      width: 140,
      render: (_, record) => (
        <div>
          <Tooltip title={<FormattedMessage id="quiz.questions.table.actions.edit" />}>
            <Button
              type="dashed"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
            />
          </Tooltip>
          <span style={{ display: 'inline-block', width: '5px' }}></span>
          <Tooltip title={<FormattedMessage id="quiz.questions.table.actions.delete" />}>
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuestion(record)}
              danger
            />
          </Tooltip>
          <span style={{ display: 'inline-block', width: '5px' }}></span>
          <Tooltip title={<FormattedMessage id="quiz.questions.table.actions.send" />}>
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
        <Button onClick={handleNewQuestion}>
          {<FormattedMessage id="quiz.questions.newQuestion" />}
        </Button>
      </QuestionsTitle>
      <Table
        dataSource={questions}
        columns={columns}
        rowKey={record => record.id}
        size="small"
      />
      <QuestionModal
        visible={questionModalVisible}
        cancel={() => {
          setQuestion(null);
          setQuestionModalVisible(false);
        }}
        initialQuestion={question}
        submit={handleSubmitQuestion}
      />
      {roundModalVisible
        ? (
          <Round
            visible={roundModalVisible}
            hideModal={() => setRoundModalVisible(false)}
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

export default injectIntl(Questions);
