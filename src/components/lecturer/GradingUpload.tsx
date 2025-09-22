import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { parseLecturerFile, simulateLecturerAIAnalysis, gradeQuestions } from '../../utils/grading';
import { GradingResult } from '../../types';

interface GradingUploadProps {
  onGradingComplete: (result: GradingResult) => void;
}

const GradingUpload: React.FC<GradingUploadProps> = ({ onGradingComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(true);

    try {
      const content = await file.text();
      const questions = parseLecturerFile(content);

      if (questions.length === 0) {
        setError('No valid questions found in the file. Please check the format.');
        setIsProcessing(false);
        return;
      }

      // Validate that all questions have student answers
      const invalidQuestions = questions.filter(q => !q.studentAnswer);
      if (invalidQuestions.length > 0) {
        setError(`Found ${invalidQuestions.length} questions missing student responses. Please check the format.`);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      setIsAnalyzing(true);

      // AI analyzes questions to determine correct answers
      const analyzedQuestions = await simulateLecturerAIAnalysis(questions);

      // Extract student info from content
      const studentInfoMatch = content.match(/name:\s*(.+)/i);
      const departmentMatch = content.match(/department:\s*(.+)/i);
      const schoolMatch = content.match(/(school of .+)/i);
      const regNumberMatch = content.match(/leg number:\s*(.+)/i);
      
      const studentInfo = studentInfoMatch ? {
        name: studentInfoMatch[1].trim(),
        department: departmentMatch?.[1].trim() || '',
        school: schoolMatch?.[1].trim() || '',
        regNumber: regNumberMatch?.[1].trim() || ''
      } : undefined;

      const result = gradeQuestions(analyzedQuestions, studentInfo);
      onGradingComplete(result);
    } catch (err) {
      setError('Failed to read the file. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is Analyzing the Paper</h3>
          <p className="text-gray-600 mb-6">
            Our advanced AI is reading each question and determining the correct answers based on context and knowledge...
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

  if (isProcessing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Upload className="w-8 h-8 text-green-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Reading Student Paper</h3>
          <p className="text-gray-600 mb-6">
            Processing the uploaded file and extracting questions and student answers...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Completed Paper</h2>
        <p className="text-gray-600 mb-8">
          Upload a text file containing the student's completed test with questions, options, and their answers. Our AI will determine the correct answers and grade automatically.
        </p>

        <div className="space-y-6">
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Click to upload completed paper
            </h3>
            <p className="text-gray-500 text-sm">
              Upload a .txt file with questions, options, and student answers
            </p>
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

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-2">Required File Format</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Use a plain text (.txt) file</li>
                  <li>• Start each question with a number (e.g., "1." or "Question 1")</li>
                  <li>• List options as A), B), C), D)</li>
                  <li>• Include "Student Answer: [Letter]" or "Answer: [Letter]" for each question</li>
                  <li>• No need to include correct answers - AI will determine them</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Brain className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-blue-800 font-medium text-sm">AI-Powered Grading</p>
                <p className="text-blue-600 text-xs">
                  Advanced AI analyzes each question to determine correct answers and grade automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingUpload;