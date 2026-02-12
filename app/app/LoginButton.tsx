// this allows OAuth to work without breaking the data fetch
//
// Right now my page.tsx is a Server Component (async function Home() with a direct Supabase query)
// OAuth must run on the client because it uses window.location
//
// allegedly... the rule is:
// data should fetch server-side. Add OAuth client-side via a small child component


'use client';

import { supabase } from '@/lib/supabaseClient';

export default function LoginButton() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,

      },
    });

    if (error) {
      console.error('OAuth error:', error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
    >
      Sign in with Google
    </button>
  );
}
