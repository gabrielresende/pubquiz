class QuizChannel < ApplicationCable::Channel
  def subscribed
    stream_from "questions_for_quiz_#{quiz.id}"
    
    if quiz.owner == current_user
      stream_from "player_update_for_quiz_#{quiz.id}"
      stream_from "answers_for_quiz_#{quiz.id}"
    else
      QuizPlayer.find_or_create_by(quiz: quiz, player: current_user).update(status: :online)
    end
  end

  def send_question(data)
    ActionCable.server.broadcast "questions_for_quiz_#{params[:id]}", data_type: 'question', question: data['question']
  end

  def close_question(data)
    ActionCable.server.broadcast "questions_for_quiz_#{params[:id]}", data_type: 'close_question'
  end

  def send_answer(data)
    ActionCable.server.broadcast "answers_for_quiz_#{params[:id]}", data_type: 'answer', player_id: current_user.id, answer: data['answer']
  end

  def update_user_status(data)
    QuizPlayer.find_or_create_by(quiz: quiz, player: current_user).update(status: data['status'].to_sym)
  end

  def remove_player(data)
    if quiz.owner == current_user
      QuizPlayer.find_by(quiz: quiz, player_id: data['player_id'])&.destroy
    end
  end

  def update_questions(data)
    if quiz.owner == current_user
      quiz.questions = data['questions']
      quiz.save
    end
  end

  def update_answers(data)
    if quiz.owner == current_user
      quiz.answers = data['answers']
      quiz.save
    end
  end

  def unsubscribed
    unless current_user == quiz.owner
      QuizPlayer.find_by(quiz: quiz, player: current_user).update(status: 'offline')
    end
  end

  def quiz
    @quiz ||= Quiz.find(params[:id])
  end
end
