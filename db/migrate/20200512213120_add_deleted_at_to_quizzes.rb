class AddDeletedAtToQuizzes < ActiveRecord::Migration[6.0]
  def change
    add_column :quizzes, :deleted_at, :timestamp
  end
end
