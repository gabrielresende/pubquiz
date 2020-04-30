class User < ApplicationRecord
  has_many :owned_quizzes, foreign_key: :owner_id, class_name: 'Quiz', dependent: :destroy
  has_many :quiz_players, dependent: :destroy, foreign_key: :player_id
  has_many :quizzes, through: :quiz_players

  after_commit :notify_update

  private

  def notify_update
    quiz_players.where(status: [:online, :away]).map do |qp|
      qp.notify_player_update
    end
  end
end
