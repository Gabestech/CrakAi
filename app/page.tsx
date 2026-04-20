'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold text-amber-300 tracking-wide">
        GATED HUMOR LAB
      </h1>

      <p className="mt-4 text-zinc-400 text-sm uppercase tracking-widest">
        Welcome back {user?.email}
      </p>

      <div className="absolute top-6 right-6">
        <AuthButton />
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

        {/* UPLOAD */}
        <div
          onClick={() => router.push('/upload')}
          className="cursor-pointer bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition"
        >
          <div className="text-3xl mb-2">📸</div>
          <h2 className="text-xl font-semibold">Upload & Generate</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Let the AI cook captions
          </p>
        </div>

        {/* VOTE */}
        <div
          onClick={() => router.push('/vote')}
          className="cursor-pointer bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition"
        >
          <div className="text-3xl mb-2">😂</div>
          <h2 className="text-xl font-semibold">Judge Captions</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Pass or fail the joke
          </p>
        </div>

        {/* HISTORY */}
        <div
          onClick={() => router.push('/history')}
          className="cursor-pointer bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 transition"
        >
          <div className="text-3xl mb-2">📜</div>
          <h2 className="text-xl font-semibold">Voting History</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Review your verdicts
          </p>
        </div>

      </div>
    </main>
  );
}