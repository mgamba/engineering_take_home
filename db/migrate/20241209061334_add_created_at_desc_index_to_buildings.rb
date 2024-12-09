class AddCreatedAtDescIndexToBuildings < ActiveRecord::Migration[7.2]
  def change
    add_index :buildings, :created_at, order: {created_at: :desc}
  end
end
