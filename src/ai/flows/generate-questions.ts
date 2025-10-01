'use server';

/**
 * @fileOverview A flow that generates multiple-choice questions based on a given topic.
 *
 * - generateQuestions - A function that handles the question generation process.
 * - GenerateQuestionsInput - The input type for the generateQuestions function.
 * - GenerateQuestionsOutput - The return type for the generateQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic to generate questions about.'),
  count: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuestionsInput = z.infer<
  typeof GenerateQuestionsInputSchema
>;

const GenerateQuestionsOutputSchema = z.object({
  questions: z
    .string()
    .describe(
      'A string containing the generated multiple-choice questions with their answers.'
    ),
});
export type GenerateQuestionsOutput = z.infer<
  typeof GenerateQuestionsOutputSchema
>;

export async function generateQuestions(
  input: GenerateQuestionsInput
): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: `You are an AI assistant for educators. Your task is to generate a set of multiple-choice questions based on a given topic.

Topic: {{{topic}}}
Number of Questions: {{{count}}}

Please generate {{{count}}} multiple-choice questions about "{{{topic}}}".
For each question, provide four options (A, B, C, D) and indicate the correct answer. The output should be a single string, with each question clearly numbered and formatted with newlines.

Example format:
1. What is the capital of France?
A) Berlin
B) Madrid
C) Paris
D) Rome
Correct Answer: C

`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuestionsPrompt(input);
    return output!;
  }
);
