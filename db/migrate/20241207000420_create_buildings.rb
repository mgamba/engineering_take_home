class CreateBuildings < ActiveRecord::Migration[7.2]
  def change
    create_table :buildings do |t|
      t.references :client

      t.string :latitude
      t.string :longitude
      t.string :address
      t.string :city
      t.string :state
      t.string :zip

      t.jsonb :additional_fields, null: false, default: {}

      t.timestamps
    end
  end
end
