import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import User from './user';
import Question from './question';
import TranslationRoot from './translations';
import { FormattedMessage } from 'react-intl';
import { createConsumer } from "@rails/actioncable"

const CableApp = {};
CableApp.cable = createConsumer();

const Wrapper = styled.div`
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
  const [status, setStatus] = useState(documentIsActive() ? 'online' : 'away');

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

  useEffect(() => {
    cableApp.quiz.perform("update_user_status", { status });
  }, [status]);

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
    setStatus(documentIsActive() ? 'online' : 'away')
  }

  function documentIsActive() {
    return document.visibilityState == "visible" && document.hasFocus()
  }

  function handleDataReceived(data) {
    switch (data.data_type) {
      case 'question':
        setQuestion(data.question);
        const delay = (data.question.time || 20) * 1000;
        setTimeout(() => setQuestion(null), delay);
        return;
      case 'close_question':
        setQuestion(null);
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
          window.clearTimeout(id);
        }
        return;
      default:
        return;
    }
  }

  function handleAnswer(answer) {
    cableApp.quiz.perform("send_answer", { answer });
  }

  function handlePlayerNameChange(name) {
    cableApp.quiz.perform("update_player_name", { name });
    setPlayerName(name);
  }

  return (
    <Wrapper>
      {playerName
        ? (question
          ? <Question question={question} handleAnswer={handleAnswer} />
          : (
            <div>
              <div><FormattedMessage id="quiz.player.helloPlayer" values={{ player: playerName }} /></div>
              <div><FormattedMessage id="quiz.player.awaitingNextQuestion" /></div>
            </div>
          )
        )
        : (
          <User quizName={quizName} setPlayerName={handlePlayerNameChange} />
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
    <TranslationRoot>
      <Game
        cableApp={CableApp}
        quizId={quizId}
        quizName={quizName}
        initialPlayerName={playerName}
      />
    </TranslationRoot>,
    reactRoot,
  )
})
