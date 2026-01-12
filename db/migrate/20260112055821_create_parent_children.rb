class CreateParentChildren < ActiveRecord::Migration[8.1]
  def change
    create_table :parent_children, id: :uuid do |t|
      t.references :parent, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.references :child, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.string :relationship_type, default: "parent"
      t.boolean :notifications_enabled, default: true, null: false
      t.integer :email_frequency, default: 0, null: false # enum: daily(0), weekly(1), both(2)

      t.timestamps
    end

    add_index :parent_children, [ :parent_id, :child_id ], unique: true
  end
end
