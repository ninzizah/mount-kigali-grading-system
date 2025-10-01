'use server';

/**
 * @fileOverview A flow that takes a text file of multiple-choice questions and highlights the correct answers using AI.
 *
 * - highlightCorrectAnswers - A function that handles the process of highlighting correct answers in a multiple-choice question file.
 * - HighlightCorrectAnswersInput - The input type for the highlightCorrectAnswers function.
 * - HighlightCorrectAnswersOutput - The return type for the highlightCorrectAnswers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightCorrectAnswersInputSchema = z.object({
  questionFileContent: z
    .string()
    .describe('The content of the text file containing multiple-choice questions.'),
});
export type HighlightCorrectAnswersInput = z.infer<
  typeof HighlightCorrectAnswersInputSchema
>;

const HighlightCorrectAnswersOutputSchema = z.object({
  highlightedQuestions: z
    .string()
    .describe(
      'The questions with the correct answers highlighted. Each question-answer pair should be on a new line.'
    ),
});
export type HighlightCorrectAnswersOutput = z.infer<
  typeof HighlightCorrectAnswersOutputSchema
>;

export async function highlightCorrectAnswers(
  input: HighlightCorrectAnswersInput
): Promise<HighlightCorrectAnswersOutput> {
  return highlightCorrectAnswersFlow(input);
}

const highlightCorrectAnswersPrompt = ai.definePrompt({
  name: 'highlightCorrectAnswersPrompt',
  input: {schema: HighlightCorrectAnswersInputSchema},
  output: {schema: HighlightCorrectAnswersOutputSchema},
  prompt: `You are an AI expert at identifying the correct answer in multiple-choice questions.
  Given the following multiple-choice questions, identify the correct answer for each question and reformat the output to highlight the correct answers.
  The input is raw text so you will need to extract the questions and possible answers from it.
  Do not include any additional explanations or information.

  Multiple-choice Questions:
  {{questionFileContent}}

  For each question, make sure to highlight the single correct answer from the possible choices. The output should be parsable.
  `,
});

const highlightCorrectAnswersFlow = ai.defineFlow(
  {
    name: 'highlightCorrectAnswersFlow',
    inputSchema: HighlightCorrectAnswersInputSchema,
    outputSchema: HighlightCorrectAnswersOutputSchema,
  },
  async input => {
    const {output} = await highlightCorrectAnswersPrompt(input);
    return output!;
  }
);
