class ApiController < ActionController::API
  def current_client
    Client.find_by(id: session[:current_client_id])
  end
end
