class Client < ApplicationRecord
  has_many :buildings
  has_many :custom_fields
end
