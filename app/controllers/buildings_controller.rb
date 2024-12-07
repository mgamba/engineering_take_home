class BuildingsController < ApplicationController
  def index
    buildings = Building.all
    render json: { "total": buildings.count, buildings: }
  end
  
  def create
    building = Building.create(params)
    render json: building.as_json(root: "buildings")
  end
end
