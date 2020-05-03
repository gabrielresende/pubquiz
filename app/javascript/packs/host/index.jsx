import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import Answers from './answers';
import Question from './question';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

const loadPlayers = (quizId) => {
  return new Promise((resolve, reject) => {
    fetch(`/quizzes/${quizId}/players.json`)
    .then(res => res.json())
    .then(
      (result) => resolve(result),
      (error) => reject(error)
    );
  })
};

const Players = ({ players }) => {
  return (
    <div>
      <h3>Players</h3>
      <ul>
        {players.sort((a,b) => a.player_name.localeCompare(b.player_name)).map(player => (
          <li key={player.player_id}>{player.player_name} ({player.status})</li>
        ))}
      </ul>
    </div>
  );
};

function playerReducer(state, data) {
  return [data, ...state.filter(item => item.player_id !== data.player_id)];
}

const Host = ({ cableApp, quizId, quizName }) => {
  const [players, updatePlayer] = useReducer(playerReducer, []);
  const [answers, updateAnswer] = useReducer(playerReducer, []);

  useEffect(() => {
    loadPlayers(quizId)
      .then(res => res.map(p => updatePlayer(p)))
      .catch((e) => console.log('Error loading players', e));
  }, []);

  useEffect(() => {
    cableApp.quiz = cableApp.cable.subscriptions.create(
      { channel: "QuizChannel", id: quizId },
      { received: data => handleDataReceived(data) }
    );
  }, []);

  function handleDataReceived(data) {
    if (data.data_type == 'player') {
      updatePlayer(data);
    }
    if (data.data_type == 'answer') {
      updateAnswer(data);
    }
  }

  function sendQuestion(question) {
    cableApp.quiz.perform("send_question", { question });
  }

  return (
    <div>
      <h1>Quiz {quizName}</h1>
      <Players players={players} />
      <Question sendQuestion={sendQuestion} />
      { answers ? <Answers players={players} answers={answers} /> : null }
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('gameinfo');
  const quizId = node.getAttribute('quiz_id')
  const quizName = node.getAttribute('quiz_name')
  const reactRoot = document.body.appendChild(document.createElement('div'))
  reactRoot.setAttribute("id", "root")

  ReactDOM.render(
    <Host cableApp={CableApp} quizId={quizId} quizName={quizName} />,
    reactRoot,
  )
})
