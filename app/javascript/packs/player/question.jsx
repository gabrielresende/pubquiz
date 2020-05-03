import React from 'react';
import styled from 'styled-components'
import { InlineForm, Input } from './components'

const Container = styled.div`
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
`;

const QuestionLabel = styled.span`
  display: inline-block;
  font-size: 18pt;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Question = ({ question, handleAnswer }) => (
  <Container>
    <QuestionLabel>{question}</QuestionLabel>
    <InlineForm>
      <Input
        type="text"
        onChange={e => handleAnswer(e.target.value)}
        placeholder="Type your answer here"
      />
    </InlineForm>
  </Container>
);

export default Question;