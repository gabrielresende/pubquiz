import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Table } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const Questions = ({ questions, sendQuestion }) => {
  const [question, setQuestion] = useState(undefined);

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
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            shape="round"
            icon={<SendOutlined />}
            onClick={() => sendQuestion(record)}
          >
            Send
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div>
      <h3>Questions</h3>
      <Table
        dataSource={questions}
        columns={columns}
        rowKey={record => record.id}
      />
      <div>
        <input
          type="text"
          onChange={e => setQuestion(e.target.value)}
        />
        <button
          onClick={() => sendQuestion({ id: 'open', title: question, time: 60 })}
        >
          Send question
        </button>
      </div>
    </div>
  );
};

export default Questions;
