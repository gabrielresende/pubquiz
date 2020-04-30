import React, { useState } from 'react';

const User = ({ setPlayerName }) => {
  const [name, setName] = useState(undefined);
  
  function onKeyDownHandler(e) {
    if (e.keyCode === 13) {
      submitName();
    }
  }

  function submitName() {
    fetch('/me.json', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => setPlayerName(name)).catch(err => err);
  }
  
  return (
    <div>
      <h3>Hello!</h3>
      <p>Please type your name to continue</p>
      <div>
        <input
          type="text"
          onChange={e => setName(e.target.value)}
          onKeyDown={onKeyDownHandler}
          placeholder="Your name"
        />
        <button
          type="button"
          onClick={() => submitName(name)}
        >
          Join
        </button>
      </div>

    </div>
  );
}

export default User;