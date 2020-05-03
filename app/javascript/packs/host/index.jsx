import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import Answers from './answers';
import Questions from './questions';
import Players from './players';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

const questions = [
  {
    id: 1,
    title: 'Question A?',
    answer: 'A',
    points: 2,
    time: 60,
  },
  {
    id: 2,
    title: 'Question B?',
    answer: '76',
    points: 2,
    time: 60,
  },
  {
    id: 3,
    title: 'Question C?',
    options: ['28', '30', '32', '33'],
    answer: '33',
    points: 2,
    time: 60,
  },
  {
    id: 4,
    title: "Question D?",
    options: ['Abc', 'Def', 'Ghi', 'Jkl'],
    answer: 'Def',
    points: 2,
    time: 60,
  },
  {
    id: 5,
    title: 'Question E?',
    answer: 'E',
    points: 2,
    time: 60,
  },
];

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

function playerReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [action.payload, ...state.filter(item => item.player_id !== action.payload.player_id)];
    case 'reset':
      return action.payload;
    default:
      throw new Error();
  }
}

const Host = ({ cableApp, quizId, quizName }) => {
  const [players, updatePlayer] = useReducer(playerReducer, []);
  const [answers, updateAnswer] = useReducer(playerReducer, []);

  useEffect(() => {
    refreshPlayers()
  }, []);

  useEffect(() => {
    cableApp.quiz = cableApp.cable.subscriptions.create(
      { channel: "QuizChannel", id: quizId },
      { received: data => handleDataReceived(data) }
    );
  }, []);

  function refreshPlayers() {
    loadPlayers(quizId)
      .then(payload => updatePlayer({type: 'reset', payload}))
      .catch((e) => console.log('Error loading players', e));
  }

  function handleDataReceived(data) {
    if (data.data_type == 'player') {
      updatePlayer({type: 'add', payload: data});
    }
    if (data.data_type == 'answer') {
      updateAnswer({type: 'add', payload: data});
    }
  }

  function sendQuestion(question) {
    cableApp.quiz.perform("send_question", { question });
  }

  function removePlayer(playerId) {
    cableApp.quiz.perform("remove_player", { player_id: playerId });
    setTimeout(() => refreshPlayers(), 200);
  }

  return (
    <div>
      <h1>Quiz {quizName}</h1>
      <Players players={players} removePlayer={removePlayer} />
      <Questions questions={questions} sendQuestion={sendQuestion} />
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
