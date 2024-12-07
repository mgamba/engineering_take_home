class BuildingsController < ApiController
  def index
    # TODO serializer to add extra fields
    buildings = current_client.buildings
    render json: { "total": buildings.count, buildings: }
  end
  
  def create
    puts("\n\nIN CREATE")
    puts("PARAMS: #{params.inspect}\n\n")
    puts("PARAMS: #{building_params.inspect}\n\n")
    # TODO handle extra fields
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
    puts("\n\n--- default_fields: #{default_fields.inspect}")
    custom_fields = current_client.custom_fields.map(&:name)
    puts("\n\n--- custom_fields: #{custom_fields.inspect}")

    safe_params = params.require(:building).permit(*default_fields, *custom_fields)

    out = safe_params.slice(*default_fields).merge({
      additional_fields: safe_params.slice(*custom_fields)
    })

    puts("\n\n--- out: #{out.inspect}")
    out
  end
end
