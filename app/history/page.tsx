'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Vote = {
  id: string;
  vote_value: number;
  created_datetime_utc?: string;
  captions: {
    content: string;
    images?: { url: string } | { url: string }[];
  };
};

export default function HistoryPage() {
  const router = useRouter();

  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('caption_votes')
        .select(`
          id,
          vote_value,
          created_datetime_utc,
          captions (
            content,
            images ( url )
          )
        `)
        .eq('profile_id', user.id)
        .order('created_datetime_utc', { ascending: false });

      if (data) {
        const normalized = data.map((item: any) => ({
          ...item,
          captions: {
            ...item.captions,
            images: Array.isArray(item.captions?.images)
              ? item.captions.images[0]
              : item.captions.images,
          },
        }));

        setVotes(normalized);
      }

      setLoading(false);
    };

    fetchVotes();
  }, [router]);

  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading history...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition text-sm"
        >
          🏠 Home
        </button>

        <h1 className="text-xl font-bold tracking-widest text-amber-400">
          YOUR VOTES
        </h1>

        <div className="w-[70px]" />
      </div>

      {/* GRID */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {votes.map((vote) => {
          const image = Array.isArray(vote.captions?.images)
            ? vote.captions.images[0]
            : vote.captions?.images;

          return (
            <div
              key={vote.id}
              className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >

              {/* IMAGE */}
              {image && 'url' in image && (
                <img
                  src={image.url}
                  className="w-full h-[200px] object-cover"
                />
              )}

              {/* CONTENT */}
              <div className="p-4 flex flex-col justify-between h-[140px]">

                <p className="text-sm text-zinc-200 line-clamp-3">
                  {vote.captions?.content}
                </p>

                <div className="flex items-center justify-between mt-3">

                  {/* VOTE */}
                  <span className="text-xl">
                    {vote.vote_value === 1 ? "😂" : "👎"}
                  </span>

                  {/* TIME */}
                  {vote.created_datetime_utc && (
                    <span className="text-xs text-zinc-500">
                      {new Date(vote.created_datetime_utc).toLocaleDateString()}
                    </span>
                  )}

                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* EMPTY STATE */}
      {votes.length === 0 && (
        <div className="text-center text-zinc-500 mt-20">
          No votes yet. Go judge some captions 👀
        </div>
      )}

    </main>
  );
}