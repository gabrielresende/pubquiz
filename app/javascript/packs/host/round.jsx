import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Descriptions, Modal, Input, InputNumber } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PlayerAvatarName, PlayerBadge, PlayerName } from './components';

const InlineContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
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
  padding: 4px 0;
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
      <PlayerNameContainer>
       <PlayerAvatarName>
          <PlayerBadge player={player} />
          <PlayerName>{player.player_name}</PlayerName>
        </PlayerAvatarName>
      </PlayerNameContainer>
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
  intl,
  players,
  question,
  roundAnswers,
  visible,
  registerAnswers,
}) => {
  const duration = (question.time || 60) * 1000
  const [points, setPoints] = useState({});
  const [expiration, setExpiration] = useState(Date.now() + duration);
  const [timeLeft, setTimeLeft] = useState(formatTime(expiration - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = expiration - Date.now();

      setTimeLeft(formatTime(elapsed));

      if (elapsed < 0) {
        setTimeLeft('0:00');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(miliseconds) {
    const minutes = Math.floor(miliseconds / (1000 * 60));
    const seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function updatePoints(playerId, value) {
    setPoints({...points, [playerId]: value});
  }

  function processRound() {
    return roundAnswers.map(answer => (
      {
        player_id: answer.player_id,
        question_id: question.id,
        answer: answer.answer,
        points: points[answer.player_id] || 0,
      }
    ));
  }

  function handleRegisterRound() {
    if (expiration <= Date.now()) {
      registerRound();
      return;
    }

    Modal.confirm({
      title: intl.formatMessage({ id: "quiz.game.answers.confirmSubmitAnswerTitle" }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: "quiz.game.answers.confirmSubmitAnswerMessage" }),
      onOk() {
        registerRound();
      },
    });
  }

  function registerRound() {
    registerAnswers(processRound());
    closeQuestion();
    hideModal();
  }

  function handleCloseQuestion() {
    Modal.confirm({
      title: intl.formatMessage({ id: "quiz.game.answers.confirmCloseQuestionTitle" }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: "quiz.game.answers.confirmCloseQuestionMessage" }),
      onOk() {
        closeQuestion();
        hideModal();
      },
    });
  }

  return (
    <Modal
      title={<FormattedMessage id="quiz.game.answers.modalTitle" />}
      visible={visible}
      okText={<FormattedMessage id="quiz.game.answers.modalRegisterAnswers" />}
      cancelText={<FormattedMessage id="quiz.game.answers.modalCloseQuestion" />}
      onOk={handleRegisterRound}
      onCancel={handleCloseQuestion}
      closable={false}
      maskClosable={false}
      destroyOnClose
    >
      <Descriptions>
        <Descriptions.Item label={<FormattedMessage id="quiz.game.answers.questionTitle" />} span={3}>{question.title}</Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="quiz.game.answers.timeLeft" />}>{timeLeft}</Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="quiz.game.answers.answer" />}>{question.answer}</Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="quiz.game.answers.points" />}>{question.points}</Descriptions.Item>
      </Descriptions>

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

export default injectIntl(Answers);
