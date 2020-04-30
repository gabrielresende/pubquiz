json.extract! quiz_players, :id, :quiz_id, :player_id, :player_name, :status
json.url players_quiz_url(quiz_players.quiz_id, format: :json)
