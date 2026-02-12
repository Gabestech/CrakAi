'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Caption = {
  id: string;
  content: string;
};

export default function CaptionReel({ userId }: { userId: string }) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  // Fetch captions
  useEffect(() => {
    const fetchCaptions = async () => {
      const { data, error } = await supabase
        .from('captions')
        .select('id, content');

      if (!error && data) {
        setCaptions(data);
      }

      setLoading(false);
    };

    fetchCaptions();
  }, []);

  const handleVote = async (value: number) => {
    if (!captions[currentIndex]) return;

    setVoting(true);

    const caption = captions[currentIndex];

    await supabase.from('caption_votes').insert({
      vote_value: value,
      profile_id: userId,
      caption_id: caption.id,
    });

    setVoting(false);

    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return <div className="text-center text-white">Loading captions...</div>;
  }

  if (currentIndex >= captions.length) {
    return (
      <div className="text-center text-white text-xl mt-10">
        🎉 No more captions to rate.
      </div>
    );
  }

  const caption = captions[currentIndex];

  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <div className="bg-zinc-900 p-10 rounded-xl shadow-xl">
        <p className="text-2xl text-white font-semibold">
          {caption.content}
        </p>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button
          disabled={voting}
          onClick={() => handleVote(1)}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-bold"
        >
          👍 Agree
        </button>

        <button
          disabled={voting}
          onClick={() => handleVote(-1)}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-bold"
        >
          👎 Disagree
        </button>
      </div>
    </div>
  );
}
