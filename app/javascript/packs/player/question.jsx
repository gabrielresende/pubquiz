import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InlineForm, Input, VerticalRadio } from './components';

const Container = styled.div`
  @media (min-width: 620px) {
    min-width: 600px;
  }
  max-width: 800px;
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
      placeholder="Digite sua resposta aqui"
    />
  </InlineForm>
);

const ImageContainer = styled.div`
  width: 80%;
  margin: 20px auto;
`;

const QuestionImage = ({ url }) => (
  <ImageContainer>
    <img src={url} style={{ width: '100%' }} />
  </ImageContainer>
);

const Question = ({ question, handleAnswer }) => {
  const expiration = Date.now() + (question.time || 60) * 1000;
  const [timeLeft, setTimeLeft] = useState(formatTime(expiration - Date.now()));

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
      {(question && question.image_url)
        ? <QuestionImage url={question.image_url} />
        : null
      }
      {question.options
        ? <VerticalRadio options={question.options} handleAnswer={handleAnswer} />
        : <OpenAnswerForm handleAnswer={handleAnswer} />
      }
    </Container>
  );
}

export default Question;