# Supabase Integration Setup Guide

This guide will help you connect your Next.js app with Supabase for user data storage and management.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Your Next.js app with Clerk authentication already set up

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `scriptai` (or your preferred name)
   - Database Password: Generate a strong password and save it
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Your existing environment variables...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` (in your project root)
3. Paste it into the SQL Editor and click "Run"

This will create:

- `users` table for user profiles
- `audio_files` table for uploaded audio metadata
- `summaries` table for AI-generated summaries
- `chat_messages` table for user-AI conversations
- Row Level Security (RLS) policies for data protection
- Indexes for optimal performance

## Step 5: Configure Authentication (Important!)

Your RLS policies are designed to work with Clerk's user IDs. You need to set up a custom JWT template in Clerk:

1. Go to your Clerk Dashboard
2. Navigate to JWT Templates
3. Create a new template called "supabase"
4. Set the content to:

```json
{
  "aud": "authenticated",
  "exp": {{exp}},
  "iat": {{iat}},
  "iss": "https://your-clerk-domain.clerk.accounts.dev",
  "sub": "{{user.id}}"
}
```

5. Save the template
6. In your Supabase dashboard, go to Authentication > Settings
7. Scroll down to "JWT Settings"
8. Add your Clerk JWT verification key

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Sign in with Clerk
3. Check your Supabase dashboard > Table Editor > users table
4. You should see a new user record created automatically

## Database Schema Overview

### Users Table

- Stores user profile information synced from Clerk
- Links Clerk user IDs to Supabase user records

### Audio Files Table

- Stores metadata about uploaded audio files
- Tracks processing status and file information

### Summaries Table

- Stores AI-generated summaries, bullet points, topics, and action items
- Links to audio files

### Chat Messages Table

- Stores conversation history between users and AI
- Associated with specific audio files

## Key Features Implemented

✅ **Automatic User Sync**: Users are automatically created/updated in Supabase when they sign in with Clerk

✅ **Data Persistence**: All app data (audio files, summaries, chat messages) is now stored in Supabase

✅ **Row Level Security**: Users can only access their own data

✅ **TypeScript Support**: Full type safety with generated database types

✅ **Custom Hook**: `useUser()` hook handles user authentication and data synchronization

## Next Steps

### Update Your Components

You can now update your app components to use the Supabase data:

```typescript
import { useUser } from "../hooks/useUser";
import { saveAudioFile, getUserAudioFiles } from "../lib/audio-data";

function YourComponent() {
  const { userId, isLoading } = useUser();

  // Use userId to save/fetch user-specific data
  // Use the utility functions in audio-data.ts
}
```

### API Route Updates

Update your API routes (`/api/process-audio/route.ts`, etc.) to:

1. Verify user authentication using Clerk
2. Save results to Supabase using the utility functions
3. Associate data with the correct user

### File Storage (Optional)

Consider using Supabase Storage for audio file uploads:

1. Create a storage bucket
2. Update `upload_url` fields to point to Supabase Storage
3. Use Supabase's file upload APIs

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Make sure JWT template is correctly configured in Clerk
2. **RLS Policy Errors**: Verify that `auth.uid()` matches your Clerk user ID format
3. **Type Errors**: Regenerate types if you modify the database schema

### Regenerating Types

If you modify the database schema, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

## Security Notes

- RLS policies ensure users can only access their own data
- Anon key is safe to use in client-side code
- Never expose your service role key in client code
- All user data is isolated by Clerk user ID

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk + Supabase Integration Guide](https://clerk.com/docs/integrations/databases/supabase)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
