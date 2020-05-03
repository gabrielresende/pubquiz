import React from 'react';

const Players = ({ players, removePlayer }) => {
  return (
    <div>
      <h3>Players</h3>
      <ul>
        {players.sort((a,b) => a.player_name.localeCompare(b.player_name)).map(player => (
          <li key={player.player_id}>{player.player_name} ({player.status}) <button onClick={() => removePlayer(player.player_id)}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
