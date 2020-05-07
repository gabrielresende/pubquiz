import React from 'react';
import styled from 'styled-components';
import { Avatar, Badge } from 'antd';
import { UserOutlined } from '@ant-design/icons';

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
  flex: 1;
`;

const PlayerBadge = ({ player }) => (
  <Badge color={{online: 'lime', away: 'yellow', offline: 'red'}[player.status]} dot>
    <Avatar
      size="small"
      style={{ backgroundColor: {online: '#a0d911', away: '#fadb14', offline: '#f5222d'}[player.status] }}
      icon={<UserOutlined />}
      />
  </Badge>
);

export { PlayerAvatarName, PlayerBadge, PlayerName };
