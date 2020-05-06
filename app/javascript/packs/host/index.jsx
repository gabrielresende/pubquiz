import React, { useEffect, useReducer, useState } from 'react';
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
    title: "Qual a cor do cavalo branco de napoleão?",
    options: ['Marrom', 'Verde', 'Branco', 'Amarelo'],
    answer: 'Def',
    points: 2,
    time: 30,
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

var answersExample = [
  {
    player_id: '7da64dc2-c09d-4476-bd70-5a8a07366539',
    answers: [
      {question_id: 'a49805a8-b745-4f54-9748-85a5d636c406', answer: 'bla', points: 10},
      {question_id: '062c4406-535f-41e9-9eca-15a949d04cef', answer: '28', points: 0},
    ]
  }
]

var scoreExample = [
  {
    player_id: '7da64dc2-c09d-4476-bd70-5a8a07366539',
    score: 23,
  },
  {
    player_id: 'a49805a8-b745-4f54-9748-85a5d636c406',
    score: 18,
  }
]

const Host = ({ cableApp, quizId, quizName }) => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState([]);
  const [players, updatePlayer] = useReducer(playerReducer, []);
  const [questions, addQuestion] = useReducer((state, question) => ([...state, {id: createUUID(), ...question}]), rootQuestions);
  const [roundAnswers, updateRoundAnswer] = useReducer(playerReducer, []);

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
      updateRoundAnswer({type: 'add', payload: data});
    }
  }

  function sendQuestion(question) {
    updateRoundAnswer({type: 'reset', payload: []});
    cableApp.quiz.perform("send_question", { question });
  }

  function closeQuestion() {
    updateRoundAnswer({type: 'reset', payload: []});
    cableApp.quiz.perform("close_question");
  }

  function removePlayer(playerId) {
    cableApp.quiz.perform("remove_player", { player_id: playerId });
    setTimeout(() => refreshPlayers(), 200);
  }

  function registerAnswers(roundData) {
    const newAnswers = [...answers];
    roundData.forEach(data => {
      const ansObj = newAnswers.find(item => item.player_id === data.player_id);
      if (ansObj) {
        ansObj['answers'].push({
          question_id: data.question_id,
          answer: data.answer,
          points: data.points,
        })
      } else {
        newAnswers.push({
          player_id: data.player_id,
          answers: [{
            question_id: data.question_id,
            answer: data.answer,
            points: data.points,
          }]
        })
      }
    });

    const newScore = newAnswers.map(answer => ({
      player_id: answer.player_id,
      score: answer.answers.reduce((sum, item) => sum + item.points, 0)
    }))
    
    console.log(newAnswers);
    console.log('newScore', newScore);
    setAnswers(newAnswers);
    setScore(newScore);
  }

  return (
    <Layout
      quizName={quizName}
      players={players}
      score={score}
      removePlayer={removePlayer}
      questions={questions}
      sendQuestion={sendQuestion}
      roundAnswers={roundAnswers}
      addQuestion={addQuestion}
      closeQuestion={closeQuestion}
      registerAnswers={registerAnswers}
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
