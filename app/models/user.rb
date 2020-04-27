class User < ApplicationRecord
  has_many :owned_quizzes, foreign_key: :owner_id, class_name: 'Quiz', dependent: :destroy
end
