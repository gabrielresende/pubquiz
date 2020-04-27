import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Main from './game/main'
import User from './game/user'

const Game = props => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(undefined);

  useEffect(() => {
    fetch("/me.json").then(res => res.json()).then(
      (result) => {
        setUserName(result.name);
        setLoading(false);
      },
      (error) => console.log(error));
  }, []);

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  if (!userName) {
    return (
      <User setUserName={setUserName} />
    );
  }

  return (
    <Main userName={userName} />
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Game />,
    document.body.appendChild(document.createElement('div')),
  )
})
