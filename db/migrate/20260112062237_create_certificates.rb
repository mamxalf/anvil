class CreateCertificates < ActiveRecord::Migration[8.1]
  def change
    create_table :certificates, id: :uuid do |t|
      t.references :course_enrollment, null: false, foreign_key: true, type: :uuid
      t.string :certificate_number, null: false
      t.datetime :issued_at, null: false

      t.timestamps
    end

    add_index :certificates, :certificate_number, unique: true
  end
end
