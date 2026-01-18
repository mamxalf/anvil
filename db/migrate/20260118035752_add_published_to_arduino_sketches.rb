class AddPublishedToArduinoSketches < ActiveRecord::Migration[8.1]
  def change
    add_column :arduino_sketches, :published, :boolean, default: false
    add_column :arduino_sketches, :published_at, :datetime
    add_index :arduino_sketches, :published
  end
end
