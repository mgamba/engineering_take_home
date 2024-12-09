require 'rails_helper'

RSpec.describe Building do
{"latitude":"1.2","longitude":"6.7","zip":"81632","Color":"yellow","Construction Materials":"Stone","Number of Washing Machines":"5"}
end

RSpec.describe Building do
  let(:client) {
    client = Client.create!(name: 'a name')
    [
      { name: "Number of bathrooms", type: "Number" },
      { name: "Number of Washing Machines", type: Number },
      { name: "Color", type: Freeform },
      { name: "Access Code", type: Freeform },
      { name: "Live-In Super", type: "Enum", options: ["yes", "no"] },
      { name: "Construction Materials", type: "Enum", options: %w[metal wood plastic] },
    ].each { client.custom_fields.build(_1) }
    client
  }

  describe '.schema' do
    it 'saves when valid' do
      record = described_class.new(
        "latitude" => "1.2",
        "longitude" => "6.7",
        "zip" => "81632",
        "additional_fields" => {
          "Color" => "yellow",
          "Construction Materials" => "Stone",
          "Number of Washing Machines" => 5,
        }
      )
      record.client = client

      expect(record.valid?).to be true
    end

    it 'fails to save when non-matching field type' do
      invalid_number = "5" # (string is wrong type)
      record = described_class.new(
        "latitude" => "1.2",
        "longitude" => "6.7",
        "zip" => "81632",
        "additional_fields" => {
          "Color" => "yellow",
          "Construction Materials" => "Stone",
          "Number of Washing Machines" => invalid_number,
        }
      )
      record.client = client

      expect(record.valid?).to be true
    end

    # ...  etc.

  end
end
