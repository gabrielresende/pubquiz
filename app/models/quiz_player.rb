class QuizPlayer < ApplicationRecord
  belongs_to :quiz
  belongs_to :player, class_name: 'User'

  enum status: [:offline, :online, :away]

  after_commit :notify_player_update

  def player_name
    player.name || 'Guest'
  end

  def notify_player_update
    ActionCable.server.broadcast "player_update_for_quiz_#{quiz_id}",
                                 data_type: 'player',
                                 player_id: player_id,
                                 player_name: player_name,
                                 status: status
  end
end
