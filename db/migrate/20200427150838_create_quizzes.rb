class CreateQuizzes < ActiveRecord::Migration[6.0]
  def change
    create_table :quizzes, id: :uuid do |t|
      t.string :name
      t.belongs_to :owner, null: false, type: :uuid, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
