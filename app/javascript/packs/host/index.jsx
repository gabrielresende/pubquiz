import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

function createUUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

const Host = ({
  cableApp,
  playUrl,
  quizAnswers,
  quizId,
  quizName,
  quizPlayers,
  quizQuestions
}) => {
  const [answers, setAnswers] = useState(quizAnswers);
  const [score, setScore] = useState([]);
  const [players, updatePlayer] = useReducer(playerReducer, quizPlayers);
  const [questions, updateQuestions] = useReducer(questionReducer, quizQuestions);
  const [roundAnswers, updateRoundAnswer] = useReducer(playerReducer, quizPlayers);

  function questionReducer(state, action) {
    let newQuestions;
    switch (action.type) {
      case 'add':
        newQuestions = [...state, {id: createUUID(), ...action.question}];
        cableApp.quiz.perform("update_questions", { questions: newQuestions });
        return newQuestions;
      case 'edit':
        newQuestions = [...state.filter(question => question.id !== action.question.id), action.question];
        cableApp.quiz.perform("update_questions", { questions: newQuestions });
        return newQuestions;
      case 'reset':
        return [action.payload];
      default:
        throw new Error();
    }
  }

  function playerReducer(state, action) {
    let newPlayers;
    switch (action.type) {
      case 'add':
        return [action.payload, ...state.filter(item => item.player_id !== action.payload.player_id)];
      case 'remove':
        newPlayers = [...state.filter(item => item.player_id !== action.playerId)];
        cableApp.quiz.perform("remove_player", { player_id: action.playerId });
        return newPlayers;
      case 'reset':
        return action.payload;
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    cableApp.quiz = cableApp.cable.subscriptions.create(
      { channel: "QuizChannel", id: quizId },
      { received: data => handleDataReceived(data) }
    );
  }, []);

  useEffect(() => {
    const newScore = answers.map(answer => ({
      player_id: answer.player_id,
      score: answer.answers.reduce((sum, item) => sum + item.points, 0)
    }));
    setScore(newScore);
  }, [answers]);

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
    updatePlayer({type: 'remove', playerId });
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

    cableApp.quiz.perform("update_answers", { answers: newAnswers });
    setAnswers(newAnswers);
  }

  return (
    <Layout
      closeQuestion={closeQuestion}
      players={players}
      playUrl={playUrl}
      questions={questions}
      quizName={quizName}
      registerAnswers={registerAnswers}
      removePlayer={removePlayer}
      roundAnswers={roundAnswers}
      score={score}
      sendQuestion={sendQuestion}
      updateQuestions={updateQuestions}
    />
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('gameinfo');
  const playUrl = node.getAttribute('play_url');
  const quizAnswers = JSON.parse(node.getAttribute('quiz_answers'));
  const quizId = node.getAttribute('quiz_id');
  const quizName = node.getAttribute('quiz_name');
  const quizPlayers = JSON.parse(node.getAttribute('quiz_players'));
  const quizQuestions = JSON.parse(node.getAttribute('quiz_questions'));
  const reactRoot = document.body.appendChild(document.createElement('div'))
  reactRoot.setAttribute("id", "root")

  ReactDOM.render(
    <Host
      cableApp={CableApp}
      playUrl={playUrl}
      quizAnswers={quizAnswers}
      quizId={quizId}
      quizName={quizName}
      quizPlayers={quizPlayers}
      quizQuestions={quizQuestions}
    />,
    reactRoot,
  )
})
