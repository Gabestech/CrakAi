'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      {user && (
        <span className="text-sm text-zinc-400">
          {user.email}
        </span>
      )}

      {user ? (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={login}
          className="px-4 py-2 bg-amber-400 text-black rounded hover:bg-amber-500"
        >
          Login
        </button>
      )}
    </div>
  );
}