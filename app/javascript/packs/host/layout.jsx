import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Col, Row, Tabs } from 'antd';
import Questions from './questions';
import Rounds from './rounds';
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

const QuizHeader = styled(PageHeader)`
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  box-shadow: 0px 1px 3px rgba(0,0,0,0.05);
`;

const TopBar = styled.div`
  background: #fff;
  padding: 20px;
`;

const Logo = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const ContentContainer = styled.div`
  padding: 16px;
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
  rounds,
  sendQuestion,
  updateQuestions,
}) => {
  return (
    <PageContainer>
      <TopBar><Logo><FormattedMessage id="title" /></Logo></TopBar>
      <div>
        <QuizHeader
          ghost={false}
          onBack={() => {window.location.href = '/'}}
          title={quizName}
          extra={[
            <OpenQuizButton key="openQuiz" link={playUrl} />,
            <ShareLinkButton key="shareLink" link={playUrl} />
          ]}
        />
        <Row>
          <Col sm={6} xs={24}>
            <Players
              players={players}
              score={score}
              removePlayer={removePlayer}
            />
          </Col>
          <Col sm={18} xs={24}>
            <ContentContainer>
              <Tabs>
                <Tabs.TabPane tab={<FormattedMessage id="quiz.questions.tab" />} key="1">
                  <Questions
                    questions={questions}
                    sendQuestion={sendQuestion}
                    updateQuestions={updateQuestions}
                    closeQuestion={closeQuestion}
                    players={players}
                    roundAnswers={roundAnswers}
                    registerAnswers={registerAnswers}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<FormattedMessage id="quiz.rounds.tab" />} key="2">
                  <Rounds
                    rounds={rounds}
                    players={players}
                    questions={questions}
                  />
                </Tabs.TabPane>
              </Tabs>
            </ContentContainer>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
}

export default PageLayout;
