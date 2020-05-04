import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import Questions from './questions';
import Players from './players';

import 'antd/dist/antd.css';
import './host.css';

import { PageHeader, Button, Descriptions } from 'antd';

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

const PageLayout = ({ quizName, players, removePlayer, questions, sendQuestion }) => {

  return (
    <PageContainer>
      <TopBar><Logo>Pub Quiz</Logo></TopBar>
      <QuizContainer>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title={quizName}
        />
        <QuizDetails>
          <Row>
            <Col sm={6} xs={24}><Players players={players} removePlayer={removePlayer} /></Col>
            <Col sm={18} xs={24}>
              <Questions questions={questions} sendQuestion={sendQuestion} />
            </Col>
          </Row>
        </QuizDetails>
      </QuizContainer>
    </PageContainer>
  );
}

export default PageLayout;