require 'rails_helper'

RSpec.describe "Buildings", type: :request do
  describe "GET /buildings" do
    it "returns a successful response" do
      building_ids = 2.times.map{create(:building).id}

      get buildings_path
      parsed_buildings = JSON.parse(response.body)['buildings']

      expect(response).to have_http_status(:ok)
      expect(parsed_buildings.map{_1['id']}).to include(*building_ids)
    end
  end
end
