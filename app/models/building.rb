class Building < ApplicationRecord
  belongs_to :client
  has_many :custom_fields, through: :client

  class << self
    def user_editable_columns
      %w[latitude longitude address city state zip]
    end
  end

  def serialized_as_json
    default_attrs = as_json.slice("id", *Building.user_editable_columns)
    all_custom_attrs = custom_fields.pluck(:name).zip([nil].cycle).to_h
    populated_custom_attrs = additional_fields["fields"] || {}

    all_custom_attrs
      .merge(populated_custom_attrs)
      .merge(default_attrs)
      .merge(client_name: client.name)
  end
end
