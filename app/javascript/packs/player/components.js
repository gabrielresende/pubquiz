import React, { useState } from 'react';
import styled from 'styled-components'

const InlineForm = styled.div`
  display: flex;
`;

const Input = styled.input`
  padding: 0.5em;
  color: ${props => props.inputColor || "palevioletred"};
  background: papayawhip;
  border: none;
  border-radius: 3px;
  flex-grow: 1;
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;


const AnswerOption = styled.label`
  display: flex;
  height: 30px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 10px 0;
  align-items: center;
  padding: 8px;
`;

const RadioContainer = styled.div`
  display: block;
`;

const RadioInput = styled.div`
  margin: 10px 0;
  cursor: pointer;
  border: 1px solid ${props => (props.selected ? "#58b" : "#eee")};;
  border-radius: 4px;
  padding: 6px;
  background: ${props => (props.selected ? "#8cf" : "#fff")};
`;

const VerticalRadio = ({ options, handleAnswer }) => {
  const [selected, setSelected] = useState(undefined);

  function handleChange(option) {
    setSelected(option);
    handleAnswer(option);
  }

  return (
    <RadioContainer>
      {options.map(option => (
        <RadioInput
          key={option}
          onClick={() => handleChange(option)}
          selected={selected === option}
        >
          {option}
        </RadioInput>
      ))}
    </RadioContainer>
  );
};

export { InlineForm, Input, Button, VerticalRadio };
