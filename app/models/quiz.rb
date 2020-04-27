class Quiz < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  has_and_belongs_to_many :players, class_name: 'User'
end
