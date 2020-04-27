json.extract! question, :id, :title, :answer, :image_url, :points, :category_id, :created_at, :updated_at
json.url question_url(question, format: :json)
