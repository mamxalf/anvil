class CreateResources < ActiveRecord::Migration[8.1]
  def change
    create_table :resources, id: :uuid do |t|
      t.references :lesson, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.integer :resource_type, default: 0, null: false  # pdf, worksheet, image, other
      t.integer :download_count, default: 0, null: false

      t.timestamps
    end
  end
end
