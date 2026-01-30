# VersoForms

A modern form submission application built for the Verso Hackathon.

**Created by:** Marvin Remiigius

## Description

VersoForms is a web application designed to streamline form creation, submission, and management. It provides a user-friendly interface for users to submit forms, track their submissions, and includes an admin panel for overseeing all activities. Built with modern web technologies, it ensures a responsive and secure experience.

## Features

- **User Authentication**: Secure login and registration using Supabase Auth
- **Form Submission**: Easy-to-use forms with validation
- **Submission Tracking**: View and manage submitted forms
- **Admin Dashboard**: Comprehensive admin panel for managing submissions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Powered by TanStack React Query for efficient data fetching

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: ShadCN UI (based on Radix UI primitives)
- **Styling**: Tailwind CSS with animations
- **Routing**: React Router DOM
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts (for potential analytics)

### Backend
- **Platform**: Supabase
  - Database: PostgreSQL
  - Authentication: Supabase Auth
  - Serverless Functions: Supabase Edge Functions

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Testing**: Vitest with Testing Library
- **Package Manager**: npm (with Bun support via bun.lockb)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd versoforms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Configure environment variables (create a `.env` file):
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run database migrations** (if any):
   - Supabase migrations are included in the `supabase/migrations/` directory

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Usage

1. **Register/Login**: Create an account or log in to access the application.
2. **Submit Forms**: Fill out and submit forms as needed.
3. **View Submissions**: Track your submitted forms and their status.
4. **Admin Access**: If you have admin privileges, access the admin dashboard to manage all submissions.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint
- `npm run test`: Run tests with Vitest

## Deployment

This project can be deployed using various platforms:

- **Lovable**: Click on Share -> Publish in your Lovable project dashboard
- **Vercel/Netlify**: Connect your repository and deploy automatically
- **Manual**: Build the project (`npm run build`) and serve the `dist` folder

## Contributing

This project was created for the Verso Hackathon. For contributions or improvements, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
