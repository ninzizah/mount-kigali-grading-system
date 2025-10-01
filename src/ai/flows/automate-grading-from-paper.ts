'use server';
/**
 * @fileOverview Implements the automatic grading of student papers using AI.
 *
 * - automateGrading - A function to automate the grading process.
 * - AutomateGradingInput - The input type for the automateGrading function.
 * - AutomateGradingOutput - The return type for the automateGrading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomateGradingInputSchema = z.object({
  paperText: z
    .string()
    .describe(
      'A text file representing a student\'s completed multiple-choice test.  The file must be formatted with a few key pieces of information for each question: The question text and its options (e.g., A, B, C). A line that specifies the correct answer, like Correct Answer: B. A line that specifies the answer the student chose, like Student: C.'
    ),
});
export type AutomateGradingInput = z.infer<typeof AutomateGradingInputSchema>;

const AutomateGradingOutputSchema = z.object({
  overallScore: z.number().describe('The overall score for the paper as a percentage.'),
  letterGrade: z.string().describe('The final letter grade (A, B, C, D, or F).'),
  passedQuestions: z.number().describe('The total number of questions passed.'),
  totalQuestions: z.number().describe('The total number of questions in the paper.'),
  questionBreakdown: z.array(
    z.object({
      question: z.string().describe('The question text.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      studentAnswer: z.string().describe('The student\'s answer to the question.'),
      isCorrect: z.boolean().describe('Whether the student answered the question correctly.'),
    })
  ),
});
export type AutomateGradingOutput = z.infer<typeof AutomateGradingOutputSchema>;

export async function automateGrading(input: AutomateGradingInput): Promise<AutomateGradingOutput> {
  return automateGradingFlow(input);
}

const automateGradingPrompt = ai.definePrompt({
  name: 'automateGradingPrompt',
  input: {schema: AutomateGradingInputSchema},
  output: {schema: AutomateGradingOutputSchema},
  prompt: `You are an AI assistant that automatically grades student papers based on the provided text file.

The text file contains the questions, the correct answers, and the student's answers for each question.
Your task is to parse the file, compare the student's answers to the correct answers, and generate a grading report. The system will use reasoning to determine how or when to make use of the 'correct answer'.

The grading report should include the following:
- Overall score for the paper as a percentage.
- Final letter grade (A, B, C, D, or F).
- Total number of questions passed.
- A detailed, question-by-question breakdown, including:
  - The question text.
  - The correct answer.
  - The student's answer.
  - Whether the student answered the question correctly.

Here is the content of the student paper:
{{{paperText}}}`,
});

const automateGradingFlow = ai.defineFlow(
  {
    name: 'automateGradingFlow',
    inputSchema: AutomateGradingInputSchema,
    outputSchema: AutomateGradingOutputSchema,
  },
  async input => {
    const {output} = await automateGradingPrompt(input);
    return output!;
  }
);
