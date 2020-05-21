import React from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Empty, Modal, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PlayerAvatarName, PlayerBadge, PlayerName } from './components';

const { confirm } = Modal;

const Container = styled.div`
  @media (min-width: 575px) {
    border-right: 1px solid #eee;
  }
  height: 100%;
  padding: 16px;
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const PlayerScore = styled.span`
  margin-left: 5px;
  margin-right: 5px;
  color: #999;
  font-style: italic;
  text-align: right;
`;

const PlayerComponent = ({ intl, player, removePlayer, score }) => (
  <PlayerContainer>
    <PlayerAvatarName>
      <PlayerBadge player={player} />
      <PlayerName>{player.player_name}</PlayerName>
      <PlayerScore>{score}</PlayerScore>
    </PlayerAvatarName>
    <div>
      <Tooltip title={<FormattedMessage id="quiz.players.remove" />}>
        <Button
          type="link"
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => confirm({
            title: intl.formatMessage({ id: 'quiz.players.remove.modalTitle' }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({ id: 'quiz.players.remove.modalMessage' }),
            onOk() { removePlayer(player.player_id) },
            onCancel() {},
          })}
        />
      </Tooltip>
    </div>
  </PlayerContainer>
);

const Player = injectIntl(PlayerComponent);

const Players = ({ players, removePlayer, score }) => {
  function scoreFor(playerId) {
    const playerScore = score.find(item => item.player_id === playerId);
    return playerScore ? playerScore.score : 0;
  }

  return (
    <Container>
      <h3><FormattedMessage id="quiz.players.title" /></h3>
      {(Array.isArray(players) && players.length)
        ? players.sort((a,b) => scoreFor(b.player_id) - scoreFor(a.player_id))
          .map(player => (
            <Player
              key={player.player_id}
              player={player}
              score={scoreFor(player.player_id)}
              removePlayer={removePlayer}
            />
          ))
        : <Empty description={<FormattedMessage id="quiz.players.empty" />} />
      }
    </Container>
  );
};

export default Players;
