class AddQuestionsAndAnswersToQuiz < ActiveRecord::Migration[6.0]
  def change
    add_column :quizzes, :questions, :jsonb, default: []
    add_column :quizzes, :answers, :jsonb, default: []
  end
end
