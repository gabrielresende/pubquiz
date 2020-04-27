class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions, id: :uuid do |t|
      t.text :title
      t.text :answer
      t.string :image_url
      t.integer :points
      t.references :category, null: false, type: :uuid, foreign_key: true, index: true

      t.timestamps
    end
  end
end
