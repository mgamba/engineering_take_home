class Building < ApplicationRecord
  belongs_to :client
  has_many :custom_fields, through: :client

  class << self
    def user_editable_columns
      %w[latitude longitude address city state zip]
    end

    def metadata(custom_fields:)
      default_fields = Building.user_editable_columns.map{{ name: _1, type: "Freeform" }}.as_json
      custom_fields = custom_fields.as_json(only: [:name, :type, :options])
      default_fields + custom_fields
    end
  end

  def serialized_as_json
    default_attrs = as_json.slice("id", "client_id", *Building.user_editable_columns)
    all_custom_attrs = custom_fields.pluck(:name).zip([nil].cycle).to_h
    populated_custom_attrs = additional_fields

    all_custom_attrs
      .merge(populated_custom_attrs)
      .merge(default_attrs)
      .merge(client_name: client.name)
  end

  def metadata
    Building.metadata(custom_fields:)
  end
end
