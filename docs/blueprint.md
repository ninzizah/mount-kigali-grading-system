# **App Name**: Kigali GradeAI

## Core Features:

- Student Login: Secure login for students with a personalized dashboard and motivational quotes.
- Question Upload: Allows students to upload text files containing multiple-choice questions from study materials.
- Lecturer Login: Secure login for lecturers with a dedicated grading dashboard.
- Automated Grading: Uses Hugging Face to automatically grade student papers by comparing student answers to the correct answers provided in the uploaded file. The system will use reasoning to determine how or when to make use of the 'correct answer'.
- Grading Report: Generates a comprehensive grading report with an overall score, letter grade, statistics, and a question-by-question breakdown, highlighting incorrect answers and their corrections.
- Admin User Management: Provides admin access to manage all student and lecturer accounts, including creating, updating, and deleting users. It will save user data to a Mongo DB instance (using Compass Mongo DB).

## Style Guidelines:

- Primary color: Light grayish-blue (#8FBEDF) for a calming and trustworthy interface, inspired by an academic environment and Rwanda's national colors. This hue evokes a sense of learning.
- Background color: Very light grayish-blue (#F0F4F8) to provide a clean and non-distracting backdrop for content.
- Accent color: Pale cyan (#A0D2DB) to highlight key actions and interactive elements, adding a subtle yet effective visual cue.
- Headline font: 'Space Grotesk' sans-serif for headers and titles, gives computerized techy and scientific feel. Body font: 'Inter' sans-serif to ensure readability and clarity.
- Use a set of consistent, professional icons to represent actions and concepts. Preferably outline style to maintain a clean and modern look.
- Emphasize a clean, organized layout with clear visual hierarchy to ensure ease of navigation and a distraction-free learning environment.
- Use subtle animations, such as smooth transitions and micro-interactions, to enhance user engagement without being distracting.