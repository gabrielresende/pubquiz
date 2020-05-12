class Quiz < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_many :quiz_players, dependent: :destroy
  has_many :players, through: :quiz_players

  scope :undeleted, -> { where(deleted_at: nil) }
end
