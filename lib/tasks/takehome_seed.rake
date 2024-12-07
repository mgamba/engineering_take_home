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
          [
            {
              name: "Number of bathrooms",
              type: "Number",
            }, {
              name: "Number of Washing Machines",
              type: Number,
            }, {
              name: "Color",
              type: Freeform,
            }, {
              name: "Access Code",
              type: Freeform,
            }, {
              name: "Live-In Super",
              type: "Enum",
            }, {
              name: "Construction Materials",
              type: "Enum",
            },
          ].each { client.custom_fields.create(_1) }
        }

        # Seed a small sample of buildings for each client
        # that contain values for the custom fields.
        clients.each { |client|
          rand(3..8).times {
            client.buildings.create(
              latitude: Faker::Address.latitude,
              longitude: Faker::Address.longitude,
              address: Faker::Address.street_address,
              city: Faker::Address.city,
              state: Faker::Address.state,
              zip: Faker::Address.zip[0...5],
              additional_fields: {
                fields: [
                  {
                    name: "Number of Washing Machines",
                    value: rand(10),
                  }, {
                    name: "Color",
                    value: Faker::Color.color_name,
                  }, {
                    name: "Access Code",
                    value: 6.times.map{rand(10)}.join,
                  }, {
                    name: "Live-In Super",
                    value: "Enum",
                    options: ["yes", "no"],
                  }, {
                    name: "Construction Materials",
                    value: "Enum",
                    options: 5.times { Faker::Construction.material },
                  },
                ].shuffle.first(rand(1...5))
              }
            )
          }
        }
      end
    end
  end
end
