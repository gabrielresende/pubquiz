import React, { useState } from 'react';
import styled from 'styled-components'
import { InlineForm, Input, Button } from './components'

const Container = styled.div`
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
`;

const Title = styled.span`
  font-size: 18pt;
  font-weight: bold;
`;

const User = ({ quizName, setPlayerName }) => {
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
    <Container>
      <Title>Bem-vindo ao {quizName}</Title>
      <p>Digite seu nome para continuar</p>
      <InlineForm>
        <Input
          type="text"
          onChange={e => setName(e.target.value)}
          onKeyDown={onKeyDownHandler}
          placeholder="Seu nome"
        />
        <Button
          type="button"
          primary
          onClick={() => submitName(name)}
        >
          Entrar
        </Button>
      </InlineForm>
    </Container>
  );
}

export default User;