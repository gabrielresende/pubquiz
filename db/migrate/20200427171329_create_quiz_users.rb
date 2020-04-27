class CreateQuizUsers < ActiveRecord::Migration[6.0]
  def change
    create_join_table :quizzes, :users, column_options: {type: :uuid}
  end
end
