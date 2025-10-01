import type { AutomateGradingOutput } from '@/ai/flows/automate-grading-from-paper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  FileText,
  Percent,
  Target,
  XCircle,
  Download,
} from 'lucide-react';
import { Button } from '../ui/button';
import { downloadTextFile } from '@/lib/download';

type GradingReportProps = {
  report: AutomateGradingOutput;
  studentInfo: string;
  lecturerName: string;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function GradingReport({
  report,
  studentInfo,
  lecturerName,
}: GradingReportProps) {
  const handleDownload = () => {
    let content = `${studentInfo}\n\n`;
    content += '----------------------------------------\n';
    content += '           GRADING REPORT\n';
    content += '----------------------------------------\n\n';

    report.questionBreakdown.forEach((item, index) => {
      content += `Q${index + 1}: ${item.question}\n`;
      content += `Student Answer: ${item.studentAnswer}\n`;
      if (!item.isCorrect) {
        content += `Correct Answer: ${item.correctAnswer}\n`;
      }
      content += `Result: ${item.isCorrect ? 'Correct' : 'Incorrect'}\n\n`;
    });

    content += '----------------------------------------\n';
    content += '              SUMMARY\n';
    content += '----------------------------------------\n';
    content += `Overall Score: ${report.overallScore}%\n`;
    content += `Letter Grade: ${report.letterGrade}\n`;
    content += `Questions Passed: ${report.passedQuestions} / ${report.totalQuestions}\n\n`;
    content += `${lecturerName}\n`;

    downloadTextFile(content, 'grading-report.txt');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Grading Report</CardTitle>
            <CardDescription>
              An AI-generated summary of the student's performance.
            </CardDescription>
          </div>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Overall Score"
              value={`${report.overallScore}%`}
              icon={Percent}
            />
            <StatCard
              title="Letter Grade"
              value={report.letterGrade}
              icon={FileText}
            />
            <StatCard
              title="Questions Passed"
              value={`${report.passedQuestions} / ${report.totalQuestions}`}
              icon={CheckCircle2}
            />
            <StatCard
              title="Accuracy"
              value={`${((report.passedQuestions / report.totalQuestions) * 100).toFixed(1)}%`}
              icon={Target}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Question Breakdown</CardTitle>
          <CardDescription>
            A detailed view of each question and the student's answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Student Answer</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.questionBreakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.question}</TableCell>
                    <TableCell>{item.studentAnswer}</TableCell>
                    <TableCell className="font-semibold">
                      {item.correctAnswer}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.isCorrect ? (
                        <Badge
                          variant="secondary"
                          className="border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Incorrect
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
