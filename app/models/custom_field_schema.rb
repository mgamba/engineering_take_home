class CustomFieldSchema < ApplicationRecord
  include ActiveModel::Validations
  validates_with CustomFieldSchemaValidator

  belongs_to :client
end
