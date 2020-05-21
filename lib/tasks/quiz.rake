namespace :quiz do
  desc "Quiz related tasks"

  task rounds_from_answers: :environment do
    Quiz.find_each do |quiz|
      next unless quiz.rounds == []

      question_ids = quiz.answers.flat_map{|a1| a1['answers'].map{|a2| a2['question_id']} }.uniq

      rounds = question_ids.map { |id| quiz.questions.find{|q| q['id'] == id} }.compact.sort_by{ |q| q['sent_at'] }.map do |question|
        answers_array = quiz.answers.reduce([]) do |result, item|
          answer = item['answers'].find{|a| a['question_id'] == question['id']}
          next result unless answer
          result << { player_id: item['player_id'], answer: answer['answer'], points: answer['points'] }
        end

        {
          id: SecureRandom.uuid,
          question_id: question['id'],
          question_title: question['title'],
          answers: answers_array
        }
      end

      quiz.rounds = rounds

      if quiz.save
        print '.'
      else
        print 'x'
      end
    end
  end
end
