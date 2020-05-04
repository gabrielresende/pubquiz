import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InlineForm, Input, VerticalRadio } from './components';

const Container = styled.div`
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
`;

const QuestionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #ccc;
`;

const Divider = styled.hr`
  border: 1px dashed #eee;
  border-style: none none dashed; 
  color: #fff;
  background-color: #fff;
`;

const QuestionLabel = styled.span`
  display: inline-block;
  font-size: 18pt;
  font-weight: bold;
  margin-bottom: 20px;
`;

const OpenAnswerForm = ({ handleAnswer }) => (
  <InlineForm>
    <Input
      type="text"
      onChange={e => handleAnswer(e.target.value)}
      placeholder="Type your answer here"
    />
  </InlineForm>
);

const Question = ({ question, handleAnswer }) => {
  const duration = (question.time || 60) * 1000
  const expiration = Date.now() + duration;
  const [timeLeft, setTimeLeft] = useState(formatTime(duration - 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = expiration - new Date().getTime();

      setTimeLeft(formatTime(elapsed));

      if (elapsed < 0) {
        setTimeLeft(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(miliseconds) {
    const minutes = Math.floor(miliseconds / (1000 * 60));
    const seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return (
    <Container>
      <QuestionInfo>
        <div>{question.points || 1} pt{(question.points > 1) ? 's' : null}</div>
        <div>{timeLeft}</div>  
      </QuestionInfo>
      <Divider />
      <QuestionLabel>{question.title}</QuestionLabel>
      {question.options
        ? <VerticalRadio options={question.options} handleAnswer={handleAnswer} />
        : <OpenAnswerForm handleAnswer={handleAnswer} />
      }
    </Container>
  );
}

export default Question;