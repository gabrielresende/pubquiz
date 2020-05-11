import React, {useRef} from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  >
    <FormattedMessage id="quiz.operations.open" />
  </Button>
)

const ShareLinkButtonComponent = ({ intl, link }) => {
  const linkInput = useRef(null);

  function copyLinkToClipboard() {
    const { current: { input } } = linkInput;
    input.select();
    document.execCommand("copy");
    message.success(
      intl.formatMessage({ id: "quiz.operations.share.copiedToClipboard" })
    );
  }

  return(
    <div style={{ display: 'inline-block' }}>
      <Popover
        placement="bottomRight"
        content={(
          <div>
            <p>
              <FormattedMessage id="quiz.operations.share.shareLinkWithPlayers" />
            </p>
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
        <Button type="primary"><FormattedMessage id="quiz.operations.share.shareLink" /> <DownOutlined /></Button>
      </Popover>
    </div>
  );
}

const ShareLinkButton = injectIntl(ShareLinkButtonComponent)

export { OpenQuizButton, ShareLinkButton };
