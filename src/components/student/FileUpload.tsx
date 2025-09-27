import React, { useState, useRef } from 'react';
import { Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { parseStudentFile, simulateAIAnalysis } from '../../utils/grading';
import { Question } from '../../types';

interface FileUploadProps {
  onQuestionsAnalyzed: (questions: Question[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onQuestionsAnalyzed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setError('Please upload a text (.txt) file only.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const content = await file.text();
      const questions = parseStudentFile(content);

      if (questions.length === 0) {
        setError('No valid questions found in the file. Please check the format.');
        setIsUploading(false);
        return;
      }

      setIsUploading(false);
      setIsAnalyzing(true);

      // Simulate AI analysis
      const analyzedQuestions = await simulateAIAnalysis(questions);
      onQuestionsAnalyzed(analyzedQuestions);
    } catch (err) {
      setError('Failed to read the file. Please try again.');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
            <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is Analyzing Your Questions</h3>
          <p className="text-gray-600 mb-6">
            Our Hugging Face AI is analyzing each question and determining the correct answers using advanced language models...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Questions</h2>
        <p className="text-gray-600 mb-8">
          Upload a text file containing your questions and multiple choice options. Our AI will analyze them and provide you with a comprehensive study guide.
        </p>

        <div className="space-y-6">
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? 'Processing...' : 'Click to upload your questions'}
            </h3>
            <p className="text-gray-500 text-sm">
              {isUploading ? 'Reading your file...' : 'Upload a .txt file with your questions and options'}
            </p>
            {isUploading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">File Format Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use a plain text (.txt) file</li>
                  <li>• Start each question with a number (e.g., "1." or "Question 1")</li>
                  <li>• List options as A), B), C), D)</li>
                  <li>• No need to include correct answers - our AI will determine them</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;