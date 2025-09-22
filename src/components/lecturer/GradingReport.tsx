import React from 'react';
import { BarChart3, CheckCircle, XCircle, Award, FileText, RotateCcw, Download } from 'lucide-react';
import { GradingResult, Question } from '../../types';

interface GradingReportProps {
  result: GradingResult;
  onNewGrading: () => void;
}

const GradingReport: React.FC<GradingReportProps> = ({ result, onNewGrading }) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';

  // Sort questions by their original order (extract number from question text)
  const sortedQuestions = [...result.questions].sort((a, b) => {
    const getQuestionNumber = (text: string) => {
      const match = text.match(/^(\d+)\./);
      return match ? parseInt(match[1]) : 0;
    };
    return getQuestionNumber(a.text) - getQuestionNumber(b.text);
  });
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  // Sort all questions by their original order (Q1, Q2, Q3, etc.)
  const sortedQuestions = [...result.questions].sort((a, b) => {
    const getQuestionNumber = (text: string) => {
      const match = text.match(/^(\d+)\./);
      return match ? parseInt(match[1]) : 0;
    };
    return getQuestionNumber(a.text) - getQuestionNumber(b.text);
  });

  const exportReport = () => {
    const reportContent = `
MOUNT KIGALI GRADING SYSTEM - STUDENT REPORT
=============================================

STUDENT INFORMATION:
Name: ${result.studentInfo?.name || 'N/A'}
Department: ${result.studentInfo?.department || 'N/A'}
School: ${result.studentInfo?.school || 'N/A'}
Registration Number: ${result.studentInfo?.regNumber || 'N/A'}

GRADING RESULTS:
Overall Score: ${result.percentage}%
Final Grade: ${result.letterGrade}
Correct Answers: ${result.correctAnswers}/${result.totalQuestions}

DETAILED BREAKDOWN:
${sortedQuestions.map((q, index) => {
  const questionNumber = q.text.match(/^(\d+)\./)?.[1] || (index + 1);
  const isCorrect = q.correctAnswer?.toLowerCase() === q.studentAnswer?.toLowerCase();
  return `
Q${questionNumber}. ${q.text}
Student Answer: ${q.studentAnswer} ${isCorrect ? '✓' : '✗'}
Correct Answer: ${q.correctAnswer}
${q.options?.map(opt => `  ${opt}`).join('\n') || ''}
`;
}).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.studentInfo?.name || 'Student'}_Grading_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Grading Report</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button
              onClick={onNewGrading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Grade New Paper
            </button>
          </div>
        </div>

        {/* Student Information */}
        {result.studentInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Name:</span>
                <span className="ml-2 text-blue-800">{result.studentInfo.name}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Department:</span>
                <span className="ml-2 text-blue-800">{result.studentInfo.department}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">School:</span>
                <span className="ml-2 text-blue-800">{result.studentInfo.school}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Reg Number:</span>
                <span className="ml-2 text-blue-800">{result.studentInfo.regNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold mb-1 px-3 py-1 rounded-full inline-block ${getGradeBgColor(result.letterGrade)}`}>
              {result.letterGrade}
            </div>
            <div className="text-sm text-gray-600">Final Grade</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{result.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {result.totalQuestions - result.correctAnswers}
            </div>
            <div className="text-sm text-gray-600">Incorrect Answers</div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="bg-gray-100 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${result.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span className="font-medium">{result.percentage}% Complete</span>
          <span>100%</span>
        </div>
      </div>

      {/* All Questions in Sequential Order */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Question Analysis</h3>
        <div className="space-y-4">
          {sortedQuestions.map((question) => {
            const questionNumber = question.text.match(/^(\d+)\./)?.[1] || '0';
            const isCorrect = question.correctAnswer?.toLowerCase() === question.studentAnswer?.toLowerCase();
            
            return (
              <div key={question.id} className={`border rounded-lg p-4 ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="font-medium text-gray-900 pr-4">Q{questionNumber}. {question.text}</p>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      <strong>Student Answer:</strong> {question.studentAnswer} {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      <span className="text-green-700">
                        <strong>Correct Answer:</strong> {question.correctAnswer} ✓
                      </span>
                    </div>
                  )}
                </div>
                
                {question.options && (
                  <div className={`pt-3 border-t ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {question.options.map((option, optIdx) => (
                        <div key={optIdx} className={`p-2 rounded ${
                          option.charAt(0) === question.correctAnswer ? 'bg-green-100 text-green-800 font-medium' : 
                          option.charAt(0) === question.studentAnswer && !isCorrect ? 'bg-red-100 text-red-800' : 'text-gray-600'
                        }`}>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Grading Complete!</h3>
            <p className="text-green-100">
              Paper processed successfully with {result.correctAnswers} out of {result.totalQuestions} questions correct.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{result.percentage}%</div>
            <div className="text-green-100">Final Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingReport;