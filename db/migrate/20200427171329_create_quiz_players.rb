class CreateQuizPlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :quiz_players, id: :uuid do |t|
      t.belongs_to :quiz, null: false, type: :uuid, foreign_key: true, index: true
      t.belongs_to :player, null: false, type: :uuid, foreign_key: { to_table: :users }, index: true
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
