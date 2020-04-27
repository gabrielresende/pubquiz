class User < ApplicationRecord
  has_many :owned_quizzes, foreign_key: :owner_id, class_name: 'Quiz', dependent: :destroy
  has_and_belongs_to_many :quizzes
end
