require 'rails_helper'

RSpec.describe "Buildings", type: :request do
  let(:client) { create(:client) }

  describe "GET /buildings" do
    it "returns a successful response" do
      building_ids = 2.times.map{create(:building, client:).id}

      get buildings_path(format: :json)
      parsed_buildings = JSON.parse(response.body)['buildings']

      expect(response).to have_http_status(:ok)
      expect(parsed_buildings.map{_1['id']}).to include(*building_ids)
    end
  end
end
