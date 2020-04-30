import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import User from './user';
import Question from './question';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

const Game = ({ cableApp, initialPlayerName, quizId }) => {
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [question, setQuestion] = useState(undefined);
  
  useEffect(() => {
    cableApp.quiz = cableApp.cable.subscriptions.create(
      { channel: "QuizChannel", id: quizId },
      { 
        connected: () => install(),
        received: data => handleDataReceived(data),
      }
      );
    }, []);
    
  function install() {
    window.addEventListener("focus", () => updateStatus("online"));
    window.addEventListener("blur", () => updateStatus("away"));
    document.addEventListener("visibilitychange", () => updateStatus(document.visibilityState === "visible" ? "online" : "away"));
  }

  function updateStatus(status) {
    console.log('updating status', status);
    cableApp.quiz.perform("update_user_status", { status });
  }

  function handleDataReceived(data) {
    if (data.data_type == 'question') {
      setQuestion(data.question);
      setTimeout(() => setQuestion(null), 20000);
    }
  }

  function handleAnswer(answer) {
    cableApp.quiz.perform("send_answer", { answer })
  }

  if (!playerName) {
    return (
      <User setPlayerName={setPlayerName} />
    );
  }

  return (
    <div>
      <div>Hello {playerName}!</div>
      {question
        ? <Question question={question} handleAnswer={handleAnswer} />
        : <div>Awaiting the start of the game</div>
      }
    </div>  
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('gameinfo');
  const quizId = node.getAttribute('quiz_id')
  const playerName = node.getAttribute('player_name')
  
  ReactDOM.render(
    <Game cableApp={CableApp} quizId={quizId} initialPlayerName={playerName} />,
    document.body.appendChild(document.createElement('div')),
  )
})
