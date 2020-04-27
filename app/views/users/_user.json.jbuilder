json.extract! user, :id, :name, :access_hash, :created_at, :updated_at
json.url user_url(user, format: :json)
