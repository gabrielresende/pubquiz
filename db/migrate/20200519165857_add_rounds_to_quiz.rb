class AddRoundsToQuiz < ActiveRecord::Migration[6.0]
  def change
    add_column :quizzes, :rounds, :jsonb, default: []
  end
end
