import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';

const Answers = ({ answers, players, questions }) => {
  function sortedQuestions() {
    return questions.filter(q => q.sent_at).sort((a,b) => (a.sent_at - b.sent_at));
  }

  function answerForPlayer(playerId, questionId) {
    const playerAnswers = answers.find(a => a.player_id === playerId);
    if (!playerAnswers || !playerAnswers.answers) {
      return null;
    }

    const answer = playerAnswers.answers.find(a => a.question_id === questionId);
    if (!answer) {
      return null;
    }

    return answer.answer;
  }

  function pointsForPlayer(playerId, questionId) {
    const playerAnswers = answers.find(a => a.player_id === playerId)
    if (!playerAnswers || !playerAnswers.answers) {
      return null;
    }

    const answer = playerAnswers.answers.find(a => a.question_id === questionId)
    if (!answer) {
      return null;
    }

    return answer.points;
  }

  function questionsAnswersForPlayer(player) {
    return questions.reduce((res, question) => {
      res[question.id] = {
        questionTitle: question.title,
        answer: answerForPlayer(player.player_id, question.id),
        points: pointsForPlayer(player.player_id, question.id),
      };
      return res;
    }, {});
  };

  function formattedData() {
    return players.sort((a,b) => a.player_name.localeCompare(b.player_name))
      .map(player => ({
        player_id: player.player_id,
        player_name: player.player_name,
        ...questionsAnswersForPlayer(player)
      }));
  }

  const columns = [
    {
      title: <FormattedMessage id="quiz.answers.table.player" />,
      dataIndex: 'player_name',
      key: 'player_name',
      fixed: 'left',
      width: 100,
    },
    ...(sortedQuestions().map(q => ({
      title: q.title,
      ellipsis: true,
      dataIndex: q.id,
      children: [
        {
          title: <FormattedMessage id="quiz.answers.table.answer" />,
          dataIndex: [q.id, 'answer'],
          key: [q.id, 'answer'],
          ellipsis: true,
        },
        {
          title: <FormattedMessage id="quiz.answers.table.points" />,
          dataIndex: [q.id, 'points'],
          key: [q.id, 'points'],
          width: 50,
          ellipsis: true,
        }
      ]
    })))
  ];

  const scrollLength = sortedQuestions().length * 180;

  return (
    <div>
      <Table
        dataSource={formattedData()}
        columns={columns}
        rowKey={record => record.player_id}
        scroll={{ x: scrollLength }}
        size="small"
      />
    </div>
  );
};

export default Answers;
