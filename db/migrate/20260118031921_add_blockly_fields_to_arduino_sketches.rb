class AddBlocklyFieldsToArduinoSketches < ActiveRecord::Migration[8.1]
  def change
    add_column :arduino_sketches, :board_type, :string, default: 'uno'
    add_column :arduino_sketches, :modules, :jsonb, default: []
    add_column :arduino_sketches, :blocks_xml, :text
  end
end
