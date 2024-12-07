class ApiController < ActionController::API
  def current_client
    Client.last
  end
end
