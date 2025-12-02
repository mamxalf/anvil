class CreateBeneficiaries < ActiveRecord::Migration[8.1]
  def change
    create_table :beneficiaries, id: :uuid do |t|
      t.string :name
      t.references :institution, null: false, foreign_key: true, type: :uuid
      t.references :target_group, null: false, foreign_key: true, type: :uuid
      t.date :date_of_birth
      t.integer :gender
      t.text :special_needs
      t.text :allergies

      t.timestamps
    end
  end
end
