class SessionsController < ApiController
  def index
    active_id = current_client&.id
    render json: Client.all.map(&:as_json).map { |client|
      client.tap { _1['signed_in'] = (_1["id"] == active_id) }
    }
  end
  
  def create
    session[:current_client_id] = params[:client_id]

    render json: current_client || {}
  end

  def show
    return not_found if current_client.nil?
    render json: current_client
  end
end
