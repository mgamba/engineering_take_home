class CreateCustomFields < ActiveRecord::Migration[7.2]
  def change
    create_table :custom_fields do |t|
      t.references :client

      t.string :name, null: false
      t.string :type, null: false
      t.string :options, array: true, null: false, default: []

      t.timestamps
    end
  end
end
