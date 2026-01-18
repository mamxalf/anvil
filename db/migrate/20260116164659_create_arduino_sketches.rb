class CreateArduinoSketches < ActiveRecord::Migration[8.1]
  def change
    create_table :arduino_sketches, id: :uuid do |t|
      t.string :name
      t.text :code
      t.references :student_profile, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
