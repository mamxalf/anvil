class CreatePortfolios < ActiveRecord::Migration[8.1]
  def change
    create_table :portfolios, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.string :slug, null: false
      t.string :theme, default: 'modern', null: false
      t.jsonb :content, default: [], null: false
      t.boolean :published, default: false, null: false

      t.timestamps
    end

    add_index :portfolios, :slug, unique: true
  end
end
