import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Empty, Table, Pagination } from 'antd';

const Round = ({ round, players }) => {
  function processData() {
    return players.map(p => {
      const answer = round.answers.find(item => item.player_id === p.player_id);
      return {
        player_id: p.player_id,
        player_name: p.player_name,
        answer: answer && answer.answer,
        points: answer && answer.points,
      };
    });
  }

  return (
    <div>
      <Table
        dataSource={processData()}
        columns={[
          {
            title: <FormattedMessage id="quiz.rounds.table.player" />,
            dataIndex: 'player_name',
            width: 140,
            ellipsis: true,
          },
          {
            title: <FormattedMessage id="quiz.rounds.table.answer" />,
            dataIndex: 'answer',
          },
          {
            title: <FormattedMessage id="quiz.rounds.table.points" />,
            dataIndex: 'points',
            width: 60,
            ellipsis: true,
          }
        ]}
        size="small"
        rowKey="player_id"
        pagination={false}
      />
    </div>
  );
}

const Rounds = ({ rounds, players }) => {
  const [index, setIndex] = useState(1);

  return (
    rounds.length
      ? (
        <Card
          style={{ width: '100%' }}
          title={rounds[index - 1].question_title}
          extra={<Pagination simple defaultCurrent={index} total={rounds.length} pageSize={1} onChange={setIndex} />}
        >
          <Round round={rounds[index - 1]} players={players}/>
        </Card>
      )
      : <Empty description={<FormattedMessage id="quiz.rounds.empty" />} />
  );
};

export default Rounds;
