'use client';

import { automateGrading } from '@/ai/flows/automate-grading-from-paper';
import type { AutomateGradingOutput } from '@/ai/flows/automate-grading-from-paper';
import { generateQuestions } from '@/ai/flows/generate-questions';
import { GradingReport } from '@/components/lecturer/grading-report';
import { QuestionGenerator } from '@/components/lecturer/question-generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function LecturerDashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [studentInfo, setStudentInfo] = useState<string>('');
  const [isGrading, startGradingTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [gradingResult, setGradingResult] =
    useState<AutomateGradingOutput | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        setGradingResult(null);
      } else {
        setError('Invalid file type. Please upload a .txt file.');
        setFile(null);
      }
    }
  };

  const handleGradingSubmit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setError(null);
    setGradingResult(null);
    setStudentInfo('');

    startGradingTransition(async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          const info = content.split('\n').find(line => !line.trim().startsWith('1.')) || '';
          setStudentInfo(info);
          const aiResult = await automateGrading({
            paperText: content,
          });
          setGradingResult(aiResult);
        };
        reader.onerror = () => {
          setError('Failed to read the file.');
        };
        reader.readAsText(file);
      } catch (e) {
        console.error(e);
        setError('An unexpected error occurred while grading the paper.');
      }
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Lecturer Dashboard
        </h1>

        <QuestionGenerator />

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Automated Grading</CardTitle>
            <CardDescription>
              Upload a student's completed paper as a .txt file. The file must
              contain the question, options, correct answer, and student's
              answer for each question.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paper-file">Completed Paper</Label>
              <Input
                id="paper-file"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={isGrading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGradingSubmit}
              disabled={!file || isGrading}
            >
              {isGrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                'Grade Paper'
              )}
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {gradingResult && user && (
          <GradingReport
            report={gradingResult}
            studentInfo={studentInfo}
            lecturerName={user.name}
          />
        )}
      </div>
    </div>
  );
}
