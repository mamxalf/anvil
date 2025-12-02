class CreateInstitutions < ActiveRecord::Migration[8.1]
  def change
    create_table :institutions, id: :uuid do |t|
      t.string :name, null: false
      t.integer :institution_type, null: false, default: 0
      t.text :address
      t.string :province
      t.string :city
      t.string :district
      t.string :postal_code
      t.string :phone
      t.string :email
      t.integer :student_count, default: 0
      t.string :contact_person

      t.timestamps
    end

    add_index :institutions, :institution_type
    add_index :institutions, :province
    add_index :institutions, :city
  end
end
