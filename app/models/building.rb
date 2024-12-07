class Building < ApplicationRecord
  include ActiveModel::Serializers::JSON

  belongs_to :client
  has_many :custom_fields, through: :client

  def attributes
    instance_attributes
  end

    #{"client_id" => nil}
    #{"latitude" => nil}
    #{"longitude" => nil}
    #{"address" => nil}
    #{"city" => nil}
    #{"state" => nil}
    #{"zip" => nil}
    #{"created_at" => nil}
    #{"updated_at" => nil}

    #{"additional_fields", default: {}, null: false
end
