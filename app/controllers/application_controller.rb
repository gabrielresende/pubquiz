class ApplicationController < ActionController::Base
  before_action :authenticate_user

  def current_user
    @current_user ||= User.find_by(access_hash: cookies[:access_hash])
  end

  private

  def authenticate_user
    return true if cookies[:access_hash] && current_user

    @current_user = User.create!(access_hash: SecureRandom.hex(32))
    cookies[:access_hash] = { value: @current_user.access_hash, expires: 10.years.from_now }
  end
end
