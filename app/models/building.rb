class Building < ApplicationRecord
  belongs_to :client
  has_many :custom_fields, through: :client

  class << self
    def user_editable_columns
      %w[latitude longitude address city state zip]
    end
  end
end
