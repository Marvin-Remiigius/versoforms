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
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with animations
- **Routing**: React Router DOM


### Backend
- **Platform**: Supabase
  - Database: PostgreSQL
  - Authentication: Supabase Auth
  - Serverless Functions: Supabase Edge Functions

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
   - Copy your project URL and publishable key
   - Create a `.env` file in the project root (reference [.env.example](.env.example)):
     ```bash
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
     VITE_SUPABASE_PROJECT_ID=your_project_id
     ```

4. **Run database migrations**:
   ```bash
   # Using Supabase CLI
   supabase db push
   ```
   - Migrations are located in `supabase/migrations/`
   - These create the necessary tables: `submissions`, `profiles`, `admin_users`

5. **Set up admin user**:
   - Run the `setup-admin` function or manually add yourself as an admin in the database
   - Admin users have access to view all submissions in the admin dashboard

6. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`.

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

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**Note:** Never commit `.env` files with sensitive credentials. The `.env.example` file shows all required variables.

## Database Schema

### Tables

**profiles**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `email` (text)
- `is_admin` (boolean)
- `created_at` (timestamp)

**submissions**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `form_data` (jsonb)
- `status` (text: 'pending', 'reviewed', 'approved', 'rejected')
- `created_at` (timestamp)
- `updated_at` (timestamp)

For detailed schema, check `supabase/migrations/` directory.

## Troubleshooting

### "Database connection failed" error
- ✅ Verify your Supabase credentials in `.env`
- ✅ Check that Supabase project is active
- ✅ Ensure your network connection is stable
- ✅ Check Supabase dashboard for any maintenance notifications

### "Authentication failed" error
- ✅ Clear browser cookies/cache
- ✅ Verify email confirmation link if using email signup
- ✅ Check that Supabase Auth is enabled in your project
- ✅ Try logging out and logging back in

### Form submission fails
- ✅ Check file size if uploading images (max 5MB recommended)
- ✅ Verify all required fields are filled
- ✅ Check browser console for detailed error messages
- ✅ Ensure database tables have correct schema

### Admin dashboard shows no submissions
- ✅ Verify your account has admin privileges in the database
- ✅ Check that submissions exist in the database
- ✅ Clear cache and refresh the page

### Vite development server won't start
- ✅ Kill any existing processes on port 8080: `netstat -ano | findstr :8080`
- ✅ Clear node_modules and reinstall: `rm -r node_modules && npm install`
- ✅ Check for TypeScript errors: `npm run lint`

## Deployment

### Production Build

```bash
npm run build
```

This generates optimized files in the `dist/` directory.

### Deployment Platforms

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```
- Follow prompts to connect your GitHub repository
- Add environment variables in Vercel dashboard
- Automatic deployments on git push

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
- Connect your Git repository for automatic deployments
- Set environment variables in Netlify dashboard

**Manual Deployment**
1. Run `npm run build`
2. Upload the `dist/` folder contents to your hosting service
3. Ensure environment variables are set on the hosting platform
4. Configure CORS if needed for Supabase requests

### Important Notes for Production

- Set `VITE_SUPABASE_PROJECT_ID` and other env vars in your hosting platform
- Enable CORS in Supabase dashboard for your domain
- Consider adding rate limiting for API calls
- Set up proper error logging and monitoring
- Regularly backup your Supabase database

## Contributing

This project was created for the Verso Hackathon. For contributions or improvements, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
