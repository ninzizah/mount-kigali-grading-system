import React, { useState } from 'react';
import { Upload, BookOpen, Star, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FileUpload from './FileUpload';
import StudyGuide from './StudyGuide';
import { Question } from '../../types';

const motivationalQuotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt"
];

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState<'upload' | 'study'>('upload');
  const [studyQuestions, setStudyQuestions] = useState<Question[]>([]);
  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const handleQuestionsAnalyzed = (questions: Question[]) => {
    setStudyQuestions(questions);
    setCurrentStep('study');
  };

  const handleNewUpload = () => {
    setCurrentStep('upload');
    setStudyQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Keep Learning, Keep Growing! 🌟</h2>
              <p className="text-blue-100 mb-4 italic">"{currentQuote}"</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Study Smart</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Track Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Study Process</h3>
              <div className="space-y-3">
                <div className={`flex items-center p-3 rounded-lg transition-colors ${
                  currentStep === 'upload' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}>
                  <Upload className="w-4 h-4 mr-3" />
                  <span className="text-sm font-medium">1. Upload Questions</span>
                </div>
                <div className={`flex items-center p-3 rounded-lg transition-colors ${
                  currentStep === 'study' ? 'bg-blue-50 text-blue-700' : 'text-gray-400'
                }`}>
                  <BookOpen className="w-4 h-4 mr-3" />
                  <span className="text-sm font-medium">2. Study Guide</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            {currentStep === 'upload' ? (
              <FileUpload onQuestionsAnalyzed={handleQuestionsAnalyzed} />
            ) : (
              <StudyGuide questions={studyQuestions} onNewUpload={handleNewUpload} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;