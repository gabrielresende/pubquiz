class PagesController < ApplicationController
  def home
    @owned_quizzes = current_user.owned_quizzes
    @quiz = Quiz.new
  end
end
