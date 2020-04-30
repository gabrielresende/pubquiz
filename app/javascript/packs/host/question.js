import React, { useState } from 'react';

const Question = ({ sendQuestion }) => {
  const [question, setQuestion] = useState(undefined);

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={e => setQuestion(e.target.value)}
        />
        <button
          onClick={() => sendQuestion(question)}
        >
          Send question
        </button>
      </div>
    </div>
  );
};

export default Question;