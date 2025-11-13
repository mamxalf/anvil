class DropSquadsTable < ActiveRecord::Migration[8.1]
  def change
    drop_table :squads, if_exists: true
  end
end
