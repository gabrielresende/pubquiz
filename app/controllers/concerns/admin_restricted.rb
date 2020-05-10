require 'active_support/concern'

module AdminRestricted extend ActiveSupport::Concern

  included do
    http_basic_authenticate_with name: ENV["ADMIN_USER"], password: ENV["ADMIN_PWD"]
  end
end