import React, {useRef} from 'react';
import styled from 'styled-components';
import { Button, Input, message, Popover } from 'antd';
import { CopyOutlined, DownOutlined } from '@ant-design/icons';

const PlayerAvatarName = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  height: 24pt;
`;

const OpenQuizButton = ({ link }) => (
  <Button
    onClick={() => window.open(link, '_blank')}
  >Open quiz</Button>
)

const ShareLinkButton = ({ link }) => {
  const linkInput = useRef(null);

  function copyLinkToClipboard() {
    const { current: { input } } = linkInput;
    input.select();
    document.execCommand("copy");
    message.success('Link copied to clipboard');
  }

  return(
    <div style={{ display: 'inline-block' }}>
      <Popover
        placement="bottomRight"
        content={(
          <div>
            <p>Share the link below with players</p>
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                ref={linkInput}
                enterButton={<CopyOutlined />}
                value={link}
                onClick={copyLinkToClipboard}
                onSearch={copyLinkToClipboard}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>
        )}
        trigger="click"
        style={{ display: 'inline-block' }}
      >
        <Button type="primary">Share link <DownOutlined /></Button>
      </Popover>
    </div>
  );
}

export { OpenQuizButton, ShareLinkButton };
