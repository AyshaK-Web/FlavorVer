# FlavorVerse: Your Culinary Adventure Companion

FlavorVerse is a modern, feature-rich recipe application designed to help users discover, manage, and explore a world of culinary delights. Built with a powerful tech stack including Next.js, Genkit, and ShadCN UI, it leverages AI to provide an intuitive and intelligent cooking experience.

## ✨ Features

- **Extensive Recipe Library**: Browse a curated collection of 220 international recipes, each with detailed instructions, nutritional information, and beautiful images.
- **Advanced Search & Filtering**: Easily find recipes by searching for ingredients, cuisine, or recipe titles. Further refine results with filters for dietary needs (vegetarian, vegan, gluten-free), cooking time, and difficulty.
- **AI-Powered Recipe Suggestions**: The "What's in your fridge?" feature uses Genkit AI to suggest recipes you can make with the ingredients you already have.
- **Smart Ingredient Substitutions**: Found a recipe but missing an ingredient? The AI-powered substitution modal suggests suitable replacements based on dietary needs or available ingredients.
- **AI Chatbot Assistant**: "FlavorBot", your friendly culinary helper, is available to answer cooking questions, suggest recipes, and provide tips.
- **User Authentication**: A demo user system allows for personalized experiences. Log in to access features like favorites and badges.
- **Favorites System**: Save your favorite recipes for quick and easy access. Favorites are stored per user.
- **Achievement Badges**: Celebrate your culinary milestones with a collection of fun badges for accomplishments like mastering spicy recipes or exploring different cuisines.
- **Dynamic Shopping List**: Generate a printable and shareable shopping list for any recipe with a single click.
- **Interactive Recipe Rating**: Rate recipes to keep track of your preferences and help others.
- **Responsive Design & Theming**: Enjoy a seamless experience across all devices with a fully responsive layout and support for both light and dark modes.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for AI flows)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these steps to get the FlavorVerse application running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Running the App

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add any necessary environment variables (e.g., API keys for AI services).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

### Demo User

To explore user-specific features like favorites and badges, use the following demo credentials on the login page:

- **Email**: `hafsa@gmail.com`
- **Password**: `123456`
