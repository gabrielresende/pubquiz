import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
import TranslationRoot from './translations';
import { createUUID } from './utils';

import { createConsumer } from "@rails/actioncable"
const CableApp = {};
CableApp.cable = createConsumer();

const Host = ({
  cableApp,
  playUrl,
  quizId,
  quizName,
  quizPlayers,
  quizRounds,
  quizQuestions
}) => {
  const [score, setScore] = useState([]);
  const [players, updatePlayer] = useReducer(playerReducer, quizPlayers);
  const [questions, updateQuestions] = useReducer(questionReducer, quizQuestions);
  const [rounds, updateRounds] = useReducer(roundsReducer, quizRounds);
  const [roundAnswers, updateRoundAnswer] = useReducer(roundAnswersReducer, quizPlayers);

  function questionReducer(state, action) {
    let newQuestions;
    switch (action.type) {
      case 'add':
        newQuestions = [...state, {id: createUUID(), ...action.question}];
        cableApp.quiz.perform("update_questions", { questions: newQuestions });
        return newQuestions;
      case 'edit':
        newQuestions = state.map(question => {
          if (question.id !== action.question.id) {
            return question;
          } else {
            return action.question;
          }
        });
        cableApp.quiz.perform("update_questions", { questions: newQuestions });
        return newQuestions;
      case 'delete':
          newQuestions = [...state.filter(question => question.id !== action.question.id)];
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
        return [action.payload, ...state.filter(item => item.player_id !== action.payload.player_id)].sort((a,b) => a.player_name.localeCompare(b.player_name));
      case 'remove':
        newPlayers = [...state.filter(item => item.player_id !== action.playerId)];
        cableApp.quiz.perform("remove_player", { player_id: action.playerId });
        return newPlayers;
      case 'reset':
        return action.payload.sort((a,b) => a.player_name.localeCompare(b.player_name));
      default:
        throw new Error();
    }
  }

  function roundsReducer(state, action) {
    let newRounds;
    switch (action.type) {
      case 'add':
        newRounds = [...state, { id: createUUID(), ...action.round }];
        cableApp.quiz.perform("update_rounds", { rounds: newRounds });
        return newRounds;
      case 'edit':
        newRounds = state.map(round => {
          if (round.id !== action.round.id) {
            return round;
          } else {
            return action.round;
          }
        });
        cableApp.quiz.perform("update_rounds", { rounds: newRounds });
        return newRounds;
      case 'delete':
          newRounds = [...state.filter(round => round.id !== action.round.id)];
          cableApp.quiz.perform("update_rounds", { rounds: newRounds });
          return newRounds;
      case 'reset':
        return [action.rounds];
      default:
        throw new Error();
    }
  }

  function roundAnswersReducer(state, action) {
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
    const newScore = players.map(player => ({
      player_id: player.player_id,
      score: rounds.reduce((sum, round) => {
        const answer = round.answers.find(answer => answer.player_id === player.player_id);
        return sum + (answer && answer.points || 0);
      }, 0)
    }));
    setScore(newScore);
  }, [rounds]);

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
    updateRounds({type: 'add', round: roundData});
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
      rounds={rounds}
      score={score}
      sendQuestion={sendQuestion}
      updateQuestions={updateQuestions}
    />
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('gameinfo');
  const playUrl = node.getAttribute('play_url');
  const quizId = node.getAttribute('quiz_id');
  const quizName = node.getAttribute('quiz_name');
  const quizPlayers = JSON.parse(node.getAttribute('quiz_players'));
  const quizRounds = JSON.parse(node.getAttribute('quiz_rounds'));
  const quizQuestions = JSON.parse(node.getAttribute('quiz_questions'));
  const reactRoot = document.body.appendChild(document.createElement('div'))
  reactRoot.setAttribute("id", "root")

  ReactDOM.render(
    <TranslationRoot>
      <Host
        cableApp={CableApp}
        playUrl={playUrl}
        quizId={quizId}
        quizName={quizName}
        quizPlayers={quizPlayers}
        quizRounds={quizRounds}
        quizQuestions={quizQuestions}
      />
    </TranslationRoot>,
    reactRoot,
  )
})
