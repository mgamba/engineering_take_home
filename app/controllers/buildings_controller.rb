class BuildingsController < ApiController
  def index
    buildings = current_client.buildings.order(created_at: :desc).page(params[:page])
    render json: { buildings: buildings.map(&:serialized_as_json) }
  end
  
  def create
    building = current_client.buildings.create!(building_params)
    render json: building.as_json(root: "buildings")
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

  private

  def building_params
    default_fields = Building.user_editable_columns
    custom_fields = current_client.custom_fields.map(&:name)

    safe_params = params.require(:building).permit(*default_fields, *custom_fields)

    safe_params.slice(*default_fields).merge({
      additional_fields: safe_params.slice(*custom_fields)
    })
  end
end
