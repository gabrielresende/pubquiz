import React from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import Questions from './questions';
import Players from './players';

import { OpenQuizButton, ShareLinkButton } from './components/quizOperations';
import { PageHeader } from 'antd';

const PageContainer = styled.div`
  background: #fefefe;
  max-width: 1200px;
  width: 80%;
  margin: 0 auto;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const TopBar = styled.div`
  background: #fff;
  padding: 20px;
`;

const Logo = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const QuizContainer = styled.div`
`;

const QuizDetails = styled.div`
  padding: 16px 24px;
`;

const PageLayout = ({
  closeQuestion,
  players,
  playUrl,
  questions,
  quizName,
  registerAnswers,
  removePlayer,
  roundAnswers,
  score,
  sendQuestion,
  updateQuestions,
}) => {
  return (
    <PageContainer>
      <TopBar><Logo>Pub Quiz</Logo></TopBar>
      <QuizContainer>
        <PageHeader
          ghost={false}
          onBack={() => {window.location.href = '/'}}
          title={quizName}
          extra={[
            <OpenQuizButton key="openQuiz" link={playUrl} />,
            <ShareLinkButton key="shareLink" link={playUrl} />
          ]}
        />
        <QuizDetails>
          <Row gutter={16}>
            <Col sm={6} xs={24}>
              <Players
                players={players}
                score={score}
                removePlayer={removePlayer}
              />
            </Col>
            <Col sm={18} xs={24}>
              <Questions
                questions={questions}
                sendQuestion={sendQuestion}
                updateQuestions={updateQuestions}
                closeQuestion={closeQuestion}
                players={players}
                roundAnswers={roundAnswers}
                registerAnswers={registerAnswers}
              />
            </Col>
          </Row>
        </QuizDetails>
      </QuizContainer>
    </PageContainer>
  );
}

export default PageLayout;