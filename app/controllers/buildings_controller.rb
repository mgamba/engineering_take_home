class BuildingsController < ApiController
  def index
    buildings = Building.order(created_at: :desc).page(params[:page])
    render json: serialize(buildings)
  end
  
  def create
    building = current_client.buildings.create!(building_params)
    render json: serialize(building)
  end
  
  def destroy
    building = current_client.buildings.where(id: params[:id]).sole
    building.destroy
    render json: {}
  end

  def metadata
    default_fields = Building.user_editable_columns.map{{ name: _1, type: "Freeform" }}
    custom_fields = current_client.custom_fields.as_json(only: [:name, :type, :options])
    render json: { metadata: default_fields + custom_fields }
  end

  def show
    building = Building.where(id: params[:id]).sole
    render json: serialize(building)
  end

  def update
    building = current_client.buildings.where(id: params[:id]).sole
    building.update!(building_params)
    render json: serialize(building)
  end
 
  private

  def building_params
    _params = { additional_fields: {} }

    default_fields = Building.user_editable_columns
    default_fields.each do |k|
      _params[k] = params[k] if params.has_key?(k)
    end

    custom_fields = current_client.custom_fields.pluck(:name)
    custom_fields.each do |k|
      _params[:additional_fields][k] = params[k] if params.has_key?(k)
    end

    request.parameters.slice(*default_fields).merge({
      additional_fields: request.parameters.slice(*custom_fields)
    })
  end

  def serialize(building_response)
    if building_response.respond_to?(:to_a)
      {
        status: "success",
        buildings: building_response.map(&:serialized_as_json)
      }
    else
      building_response.serialized_as_json
    end
  end
end
