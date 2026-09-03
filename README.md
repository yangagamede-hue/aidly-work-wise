# AI Workplace Genius

Build a modern, fully responsive SaaS web application called "AI Workplace Productivity Assistant".

LAYOUT & STYLING:

- Design Style: Modern SaaS UI with a dark slate or clean white theme, subtle card borders, and professional typography.

- Navigation: Left sidebar with icons and links for 5 main tabs:

  1. Smart Email Generator

  2. Meeting Notes Summarizer

  3. AI Task Planner

  4. AI Research Assistant

  5. AI Chatbot

- Global Footer: Fixed banner or subtle text stating: "Disclaimer: AI-generated content may require human review."

MODULE REQUIREMENTS & FEATURES:

1. Smart Email Generator:

   - Form inputs: Target Audience (Client, Manager, Team, External), Tone (Formal, Casual, Persuasive, Urgent), and Primary Topic/Details.

   - Action: "Generate Email" button with loading spinner state.

   - Output Card: Displays 3 subject line options and a structured, editable email body with a "Copy to Clipboard" button.

2. Meeting Notes Summarizer:

   - Form input: Large text area for raw meeting notes.

   - Action: "Summarize Notes" button.

   - Output Card: Divided into three clear sections—Key Decisions (bullet points), Action Items (table with assignees), and Deadlines.

3. AI Task Planner:

   - Form input: Input box for raw task list and working hours per day.

   - Action: "Generate Schedule" button.

   - Output Card: Prioritized schedule split into High/Medium/Low priority sections with suggested time blocks.

4. AI Research Assistant:

   - Form input: Text field for article text or research topic.

   - Action: "Analyze & Summarize" button.

   - Output Card: Summary paragraph, 3 key takeaways, and practical recommendations.

5. AI Chatbot Interface:

   - Full chat UI with scrollable chat message list (User and Assistant bubbles).

   - Bottom input bar with a Send button and pressing Enter support.

   - Pre-loaded welcome message introducing the Workplace Assistant.

BEHAVIOR & UX:

- Implement full interactive state behavior with realistic simulated AI responses or direct OpenAI/Gemini API key integration.

- Include smooth transitions between sidebar tabs and polished card animations.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aidly-work-wise.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80e9c8f3-3428-4c48-a1e4-88ed7e08da7f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
