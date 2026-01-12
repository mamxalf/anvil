class ChangeUserRolesForLms < ActiveRecord::Migration[8.1]
  def up
    # Update existing users before changing enum values
    # Map old roles: user(0) -> student(0), admin(1) -> admin(3)
    execute <<-SQL
      UPDATE users SET role = 3 WHERE role = 1;
    SQL

    # Add new columns to users table
    add_column :users, :avatar, :string
    add_column :users, :locale, :string, default: "id"
    add_column :users, :phone, :string
    add_column :users, :last_seen_at, :datetime

    add_index :users, :role
  end

  def down
    remove_index :users, :role
    remove_column :users, :last_seen_at
    remove_column :users, :phone
    remove_column :users, :locale
    remove_column :users, :avatar

    # Revert admin role back to 1
    execute <<-SQL
      UPDATE users SET role = 1 WHERE role = 3;
    SQL
  end
end
