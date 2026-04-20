'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 🔥 This completes login
        await supabase.auth.exchangeCodeForSession(window.location.href);

        // ✅ redirect AFTER session is set
        router.replace('/');
      } catch (err) {
        console.error('Auth error:', err);
        router.replace('/');
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="text-white text-center mt-20">
      Logging you in...
    </div>
  );
}