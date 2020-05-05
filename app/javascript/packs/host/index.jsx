import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

const rootQuestions = [
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
    time: 10,
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

function createUUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

const Host = ({ cableApp, quizId, quizName }) => {
  const [players, updatePlayer] = useReducer(playerReducer, []);
  const [answers, updateAnswer] = useReducer(playerReducer, []);
  const [questions, addQuestion] = useReducer((state, question) => ([...state, {id: createUUID(), ...question}]), rootQuestions);

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
    <Layout
      quizName={quizName}
      players={players}
      removePlayer={removePlayer}
      questions={questions}
      sendQuestion={sendQuestion}
      answers={answers}
      addQuestion={addQuestion}
    />
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
