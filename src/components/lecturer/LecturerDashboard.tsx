import React, { useState } from 'react';
import { BookOpen, FileText, BarChart3, LogOut, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GradingUpload from './GradingUpload';
import GradingReport from './GradingReport';
import { GradingResult } from '../../types';

const LecturerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'upload' | 'report'>('upload');
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);

  const handleGradingComplete = (result: GradingResult) => {
    setGradingResult(result);
    setCurrentView('report');
  };

  const handleNewGrading = () => {
    setCurrentView('upload');
    setGradingResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Lecturer Portal</h1>
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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Automated Grading System</h2>
              <p className="text-green-100 mb-4">
                Upload completed test papers and get instant, accurate grading results with detailed analytics.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Detailed Reports</span>
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
              <h3 className="font-semibold text-gray-900 mb-4">Grading Process</h3>
              <div className="space-y-3">
                <div className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'upload' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                }`} onClick={() => setCurrentView('upload')}>
                  <Upload className="w-4 h-4 mr-3" />
                  <span className="text-sm font-medium">1. Upload Paper</span>
                </div>
                <div className={`flex items-center p-3 rounded-lg transition-colors ${
                  currentView === 'report' ? 'bg-green-50 text-green-700' : gradingResult ? 'text-gray-600 cursor-pointer hover:bg-gray-50' : 'text-gray-400'
                }`} onClick={() => gradingResult && setCurrentView('report')}>
                  <BarChart3 className="w-4 h-4 mr-3" />
                  <span className="text-sm font-medium">2. View Report</span>
                </div>
              </div>
              
              {gradingResult && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className={`font-medium ${
                        gradingResult.percentage >= 70 ? 'text-green-600' : 
                        gradingResult.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {gradingResult.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium text-gray-900">{gradingResult.letterGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Correct:</span>
                      <span className="font-medium text-gray-900">
                        {gradingResult.correctAnswers}/{gradingResult.totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            {currentView === 'upload' ? (
              <GradingUpload onGradingComplete={handleGradingComplete} />
            ) : gradingResult ? (
              <GradingReport result={gradingResult} onNewGrading={handleNewGrading} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
                <p className="text-gray-500">Upload a completed paper to view the grading report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;