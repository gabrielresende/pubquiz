import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './components';

const Container = styled.div`
  margin: 20px;
`;

const QuestionContainer = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
`;

const Question = ({ title, answer, points, time, sendQuestion }) => (
  <tr>
    <td>{title}</td>
    <td>{answer}</td>
    <td>{points}</td>
    <td>{time}</td>
    <td>
      <Button
        onClick={sendQuestion}
      >
        Send question
      </Button>
    </td>
  </tr>
);

const Questions = ({ questions, sendQuestion }) => {
  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Answer</th>
            <th>Points</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(question => (
            <Question
              key={question.id}
              title={question.title}
              answer={question.answer}
              points={question.points}
              time={question.time}
              sendQuestion={() => sendQuestion(question)}
            />
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          onChange={e => setQuestion(e.target.value)}
        />
        <button
          onClick={() => sendQuestion(question)}
        >
          Send question
        </button>
      </div>
    </Container>
  );
};

export default Questions;
