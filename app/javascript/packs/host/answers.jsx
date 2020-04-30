import React, { useState } from 'react';

const Answers = ({ players, answers }) => {
  if (!answers) {
    return null;
  }

  return (
    <div>
      <ul>
        {answers.map(answer => {
          const player = players.find(player => player.player_id === answer.player_id);

          return (
            <li key={player.player_id}><strong>{player.player_name}:</strong> {answer.answer}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default Answers;