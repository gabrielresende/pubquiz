import React from 'react';

const Main = ({ question, handleAnswer }) => (
  <div>
    <h4>Question!</h4>
    <div>{question}</div>
    <div>
      <input
        type="text"
        onChange={e => handleAnswer(e.target.value)}
      />
    </div>
  </div>
)

export default Main;