class CreateNotifications < ActiveRecord::Migration[8.1]
  def change
    create_table :notifications, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :message
      t.integer :notification_type, default: 0, null: false
      t.datetime :read_at
      t.jsonb :data, default: {}

      t.timestamps
    end

    add_index :notifications, [:user_id, :read_at]
    add_index :notifications, :notification_type
  end
end
