import React from 'react';
import styled from 'styled-components';
import { Avatar, Badge, Button, Modal, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Container = styled.div`
  @media (min-width: 575px) {
    border-right: 1px solid #eee;
  }
  height: 100%;
`;

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlayerAvatarName = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  height: 24pt;
`;

const PlayerName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
`;

const PlayerActions = styled.div`
  margin-right: 10px;
`;

const Player = ({ player, removePlayer }) => (
  <PlayerContainer>
    <PlayerAvatarName>
      <PlayerBadge player={player} />
      <PlayerName>{player.player_name}</PlayerName>
    </PlayerAvatarName>
    <PlayerActions>
      <Tooltip title="Remove">
        <Button
          type="link"
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => confirm({
            title: 'Remove player?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to remove this player?',
            onOk() { removePlayer(player.player_id) },
            onCancel() {},
          })}
        />
      </Tooltip>
    </PlayerActions>
  </PlayerContainer>
);

const PlayerBadge = ({ player }) => (
  <Badge color={{online: 'lime', away: 'yellow', offline: 'red'}[player.status]} dot>
    <Avatar size="small" icon={<UserOutlined />} />
  </Badge>
);

const Players = ({ players, removePlayer }) => {
  return (
    <Container>
      <h3>Players</h3>
      {players.sort((a,b) => a.player_name.localeCompare(b.player_name)).map(player => (
        <Player
          key={player.player_id}
          player={player}
          removePlayer={removePlayer}
        />
      ))}
    </Container>
  );
};

export default Players;
