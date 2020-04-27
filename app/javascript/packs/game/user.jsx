import React, { useState } from 'react';
import Cookies from 'js-cookie';

const User = ({ setUserName }) => {
  const [name, setName] = useState(undefined);
  const userHash = Cookies.get('access_hash');
  
  function onKeyDownHandler(e) {
    if (e.keyCode === 13) {
      submitName();
    }
  }

  function submitName() {
    const data = {
      name
    };
    
    fetch('/me.json', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
      console.log('res', res);
      setUserName(name);
    }).catch(err => err);
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