import React, { useState } from 'react';
import { BookOpen, CheckCircle, Eye, EyeOff, RotateCcw, Download } from 'lucide-react';
import { Question } from '../../types';

interface StudyGuideProps {
  questions: Question[];
  onNewUpload: () => void;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ questions, onNewUpload }) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const toggleAnswer = (questionId: string) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(questionId)) {
      newRevealed.delete(questionId);
    } else {
      newRevealed.add(questionId);
    }
    setRevealedAnswers(newRevealed);
  };

  const toggleAllAnswers = () => {
    if (showAllAnswers) {
      setRevealedAnswers(new Set());
    } else {
      setRevealedAnswers(new Set(questions.map(q => q.id)));
    }
    setShowAllAnswers(!showAllAnswers);
  };

  const getOptionLetter = (option: string): string => {
    const match = option.match(/^([A-D])/);
    return match ? match[1] : option.charAt(0);
  };

  const isCorrectAnswer = (question: Question, option: string): boolean => {
    return question.correctAnswer === getOptionLetter(option);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Study Guide</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAllAnswers}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showAllAnswers ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAllAnswers ? 'Hide All' : 'Show All'} Answers
            </button>
            <button
              onClick={onNewUpload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Upload New Questions
            </button>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-green-800 font-medium">AI Analysis Complete!</p>
              <p className="text-green-600 text-sm">
                Found {questions.length} questions. Correct answers have been determined and highlighted in green.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-8">
          {questions.map((question, index) => {
            const isRevealed = revealedAnswers.has(question.id);
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {question.text}
                  </h3>
                  <button
                    onClick={() => toggleAnswer(question.id)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                  >
                    {isRevealed ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {isRevealed ? 'Hide' : 'Reveal'} Answer
                  </button>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = isCorrectAnswer(question, option);
                    const shouldHighlight = isRevealed && isCorrect;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          shouldHighlight
                            ? 'bg-green-50 border-green-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`font-medium mr-3 ${
                            shouldHighlight ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {option}
                          </span>
                          {shouldHighlight && (
                            <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isRevealed && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Correct Answer:</strong> Option {question.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyGuide;