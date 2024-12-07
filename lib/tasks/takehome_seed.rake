# rails db:seed:takehome

namespace :db do
  namespace :seed do
    desc 'Seeds for React dev'
    task clear_and_seed: :environment do
      raise "NOPE!" if Rails.env.production?

      ActiveRecord::Base.transaction do
        Building.destroy_all
        CustomField.destroy_all
        Client.destroy_all

        # Seed the clients table with 5 clients.
        # You can name the clients anything you wish.
        clients = 5.times.map {
          Client.create!(name: Faker::Company.name)
        }

        # Seed a small sample of custom fields for each client.
        clients.each { |client|
          client.custom_fields.create({
            name: "Number of bathrooms",
            type: "Number",
          })
          client.custom_fields.create({
            name: "Living room color",
            type: "Freeform",
          })
          client.custom_fields.create({
            name: "Type of walkway",
            type: "Enum",
            options: %w[Brick Concrete None],
          })
        }

        # Seed a small sample of buildings for each client
        # that contain values for the custom fields.
        clients.each { |client|
          rand(3..8).times {

          }
        }
      end
    end
  end
end
