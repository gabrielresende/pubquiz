class ApplicationController < ActionController::Base
  before_action :authenticate_user
  around_action :set_locale

  def current_user
    @current_user ||= User.find_by(access_hash: cookies[:access_hash])
  end

  private

  def authenticate_user
    return true if cookies[:access_hash] && current_user

    @current_user = User.create!(access_hash: SecureRandom.hex(32))
    cookies[:access_hash] = { value: @current_user.access_hash, expires: 10.years.from_now }
  end

  def set_locale(&action)
    locale = request.env['HTTP_ACCEPT_LANGUAGE']&.scan(/^[a-z]{2}/)&.first

    if locale && I18n.available_locales.include?(locale.to_sym)
      I18n.with_locale(locale, &action)
    else
      I18n.with_locale(I18n.default_locale, &action)
    end
  end
end
