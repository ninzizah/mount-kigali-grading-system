'use client';

import { highlightCorrectAnswers } from '@/ai/flows/highlight-correct-answers';
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
import { AlertTriangle, Lightbulb, Loader2, PartyPopper } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

const motivationalQuotes: string[] = [
  'The expert in anything was once a beginner.',
  'The secret of getting ahead is getting started.',
  "Believe you can and you're halfway there.",
  'It does not matter how slowly you go as long as you do not stop.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'The beautiful thing about learning is that no one can take it away from you.',
  'Strive for progress, not perfection.',
];

const StudyGuideDisplay = ({ content }: { content: string }) => {
  const formattedContent = content.split('\n\n').map((block, index) => {
    const lines = block.split('\n');
    return (
      <div key={index} className="mb-4 text-sm">
        {lines.map((line, lineIndex) => {
          const isHighlighted = line.includes('**');
          const lineContent = line.replace(/\*\*/g, '');
          return (
            <p
              key={lineIndex}
              className={`
                ${isHighlighted ? 'rounded-md bg-accent/80 px-2 py-1 font-semibold text-accent-foreground' : ''}
                ${line.match(/^\d+\./) ? 'font-bold mt-2' : ''}
                ${line.match(/^[A-D]\)/) ? 'ml-4' : ''}
              `}
            >
              {lineContent}
            </p>
          );
        })}
      </div>
    );
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-primary" />
          Your Smart Study Guide
        </CardTitle>
        <CardDescription>
          The correct answers have been highlighted for you. Use this to test
          your knowledge!
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none rounded-lg border bg-muted/30 p-4 text-foreground">
        {formattedContent}
      </CardContent>
    </Card>
  );
};

export default function StudentDashboard() {
  const [quote, setQuote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] =
    useState<Awaited<ReturnType<typeof highlightCorrectAnswers>> | null>(null);

  useEffect(() => {
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Invalid file type. Please upload a .txt file.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          const aiResult = await highlightCorrectAnswers({
            questionFileContent: content,
          });
          setResult(aiResult);
        };
        reader.onerror = () => {
          setError('Failed to read the file.');
        };
        reader.readAsText(file);
      } catch (e) {
        setError('An unexpected error occurred while processing the file.');
      }
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Student Dashboard
        </h1>

        {quote && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-accent bg-accent/20 p-4">
            <Lightbulb className="h-6 w-6 flex-shrink-0 text-accent-foreground/80" />
            <p className="text-sm font-medium text-accent-foreground">
              "{quote}"
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Create a Study Guide</CardTitle>
            <CardDescription>
              Upload a .txt file with multiple-choice questions to get an
              AI-powered study guide with the correct answers highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-file">Question File</Label>
              <Input
                id="question-file"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={!file || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Study Guide'
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

        {result && <StudyGuideDisplay content={result.highlightedQuestions} />}
      </div>
    </div>
  );
}
