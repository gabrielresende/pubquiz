import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Input, InputNumber } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const InlineContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PlayerPointsContainer = styled.div`
  flex-basis: 16px;
`;

const PlayerAnswerContainer = styled.div`
  flex-grow: 1;
  margin: 0 10px;
`;

const PlayerNameContainer = styled.div`
  flex-basis: 20%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerAnswer = ({ player, answer, updatePoints }) => {
  const [away, setAway] = useState(false);

  useEffect(() => {
    if (player.status === 'away') {
      setAway(true);
    }
  }, [player.status])

  return (
    <InlineContainer>
      <PlayerNameContainer>{player.player_name}</PlayerNameContainer>
      <PlayerAnswerContainer>
        <Input.TextArea
          disabled={true}
          style={{ backgroundColor: away ? '#fee' : '#fff' }}
          rows={1}
          value={answer && answer.answer}
        />
      </PlayerAnswerContainer>
      <PlayerPointsContainer>
        <InputNumber onChange={updatePoints} />
      </PlayerPointsContainer>
    </InlineContainer>
  );
}

const Answers = ({
  closeQuestion,
  hideModal,
  players,
  questionId,
  roundAnswers,
  visible,
  registerAnswers,
}) => {
  const [points, setPoints] = useState({});

  function updatePoints(playerId, value) {
    setPoints({...points, [playerId]: value});
  }

  function processRound() {
    return roundAnswers.map(answer => (
      {
        player_id: answer.player_id,
        question_id: questionId,
        answer: answer.answer,
        points: points[answer.player_id] || 0,
      }
    ));
  }

  function handleRegisterRound() {
    registerAnswers(processRound());
    closeQuestion();
    hideModal();
  }

  function handleCloseQuestion() {
    Modal.confirm({
      title: 'Close question?',
      icon: <ExclamationCircleOutlined />,
      content: 'Close this question for all players and discard answers?',
      onOk() {
        closeQuestion();
        hideModal();
      },
    });
  }

  return (
    <Modal
      title='Awaiting answers'
      visible={visible}
      okText='Register answers'
      cancelText='Close question'
      onOk={handleRegisterRound}
      onCancel={handleCloseQuestion}
      closable={false}
      maskClosable={false}
      destroyOnClose
    >
      {players.map(player => (
        <PlayerAnswer
          key={player.player_id}
          player={player}
          answer={roundAnswers.find(answer => answer.player_id === player.player_id)}
          updatePoints={value => updatePoints(player.player_id, value)}
        />
      ))}
    </Modal>
  );
}

export default Answers;