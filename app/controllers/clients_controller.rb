class ClientsController < ApiController
  def logged_in
    render json: { client: { id: current_client.id } }
  end
end
