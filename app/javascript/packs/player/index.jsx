import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import User from './user';
import Question from './question';
import { createConsumer } from "@rails/actioncable"

const CableApp = {};
CableApp.cable = createConsumer();

const Wrapper = styled.div`
  background-color: #fcfcfc;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Game = ({ cableApp, initialPlayerName, quizId, quizName }) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [question, setQuestion] = useState(undefined);
  
  useEffect(() => {
    cableApp.quiz = cableApp.cable.subscriptions.create(
      { channel: "QuizChannel", id: quizId },
      { 
        connected: () => install(),
        disconnected: () => uninstall(),
        received: data => handleDataReceived(data),
      }
      );
    }, []);
    
  function install() {
    window.addEventListener("focus", updateStatus);
    window.addEventListener("blur", updateStatus);
    document.addEventListener("visibilitychange", updateStatus);
  }

  function uninstall() {
    window.removeEventListener("focus", updateStatus);
    window.removeEventListener("blur", updateStatus);
    document.removeEventListener("visibilitychange", updateStatus);
  }

  function updateStatus() {
    const documentIsActive = document.visibilityState == "visible" && document.hasFocus();
    const status = documentIsActive ? 'online' : 'away';
    
    cableApp.quiz.perform("update_user_status", { status });
  }

  function handleDataReceived(data) {
    if (data.data_type == 'question') {
      setQuestion(data.question);
      const delay = (data.question.time || 20) * 1000;
      setTimeout(() => setQuestion(null), delay);
    }
  }

  function handleAnswer(answer) {
    cableApp.quiz.perform("send_answer", { answer })
  }

  return (
    <Wrapper>
      {playerName
        ? (question
          ? <Question question={question} handleAnswer={handleAnswer} />
          : (
            <div>
              <div>Hello {playerName}!</div>
              <div>Waiting for the next question...</div>
            </div>  
          )
        )
        : (
          <User quizName={quizName} setPlayerName={setPlayerName} />
        )
      }
    </Wrapper>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('gameinfo');
  const quizId = node.getAttribute('quiz_id')
  const quizName = node.getAttribute('quiz_name')
  const playerName = node.getAttribute('player_name')
  const reactRoot = document.body.appendChild(document.createElement('div'))
  reactRoot.setAttribute("id", "root")
  
  ReactDOM.render(
    <Game
      cableApp={CableApp}
      quizId={quizId}
      quizName={quizName}
      initialPlayerName={playerName}
    />,
    reactRoot,
  )
})
