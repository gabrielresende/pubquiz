json.extract! quiz, :id, :name, :questions, :answers, :created_at, :updated_at
json.url admin_quiz_url(quiz, format: :json)
