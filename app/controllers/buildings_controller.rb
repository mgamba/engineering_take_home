class BuildingsController < ApiController
  before_action :validate_params, only: [:create, :update]

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
    render json: { metadata: Building.metadata(custom_fields: current_client.custom_fields) }
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
    default_fields = Building.user_editable_columns
    custom_fields = current_client.custom_fields.pluck(:name)

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

  def validate_params
    metadata = Building.metadata(custom_fields: current_client.custom_fields)
    _params = request.parameters.slice(*metadata.map{_1["name"]})
    FieldValidator.validate!(metadata:, params: _params)
  rescue JSON::Schema::ValidationError => e
    render json: { status: "failure", message: e.message }, :status => :bad_request
  end
end
