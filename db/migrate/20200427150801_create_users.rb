class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name
      t.string :access_hash, index: true

      t.timestamps
    end
  end
end
