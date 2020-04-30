json.array! @quiz_players.includes(:player), partial: "quizzes/quiz_players", as: :quiz_players
