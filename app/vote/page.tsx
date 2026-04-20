'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Caption = {
  id: string;
  content: string;
  image_id: string;
  images?: { url: string } | { url: string }[];
};

/* 🔥 EMOJI POOLS */
const FUNNY_EMOJIS = ["😂","😂","🤣","😆","💀","🔥","😹","🫠"];
const NOT_FUNNY_EMOJIS = ["👎","😒","🙄","😐","🧊","💤","💩"];

/* 🎲 RANDOM HELPER */
const getRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export default function VotePage() {
  const router = useRouter();

  const [captions, setCaptions] = useState<Caption[]>([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [reaction, setReaction] = useState<"lol" | "meh" | null>(null);
  const [user, setUser] = useState<any>(null);

  const [funnyEmoji, setFunnyEmoji] = useState("😂");
  const [notFunnyEmoji, setNotFunnyEmoji] = useState("👎");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const fetchCaptions = async () => {
      const { data } = await supabase
        .from('captions')
        .select(`*, images ( url )`);

      if (data) {
        const normalized = data.map((item) => ({
          ...item,
          images: Array.isArray(item.images)
            ? item.images[0]
            : item.images,
        }));

        setCaptions(normalized.sort(() => Math.random() - 0.5));
      }
    };

    fetchCaptions();
  }, []);

  const caption = captions[index];

  const image = caption?.images
    ? Array.isArray(caption.images)
      ? caption.images[0]
      : caption.images
    : null;

  const nextCaption = () => {
    setFade(false);

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setFade(true);
      setReaction(null);

      /* 🎲 NEW EMOJIS EACH ROUND */
      setFunnyEmoji(getRandom(FUNNY_EMOJIS));
      setNotFunnyEmoji(getRandom(NOT_FUNNY_EMOJIS));

    }, 200);
  };

  const handleVote = async (value: number) => {
    if (!user) {
      router.push('/');
      return;
    }

    setReaction(value === 1 ? "lol" : "meh");

    await supabase.from('caption_votes').insert({
      vote_value: value,
      profile_id: user.id,
      caption_id: caption.id,
      created_by_user_id: user.id,
      modified_by_user_id: user.id,
    });

    setTimeout(nextCaption, 700);
  };

  if (!caption) {
    return (
      <div className="text-white text-center mt-20">
        No more captions 🎉
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">

      {/* HEADER */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition text-sm"
        >
          🏠 Home
        </button>

        <h1 className="text-xl font-bold tracking-widest text-amber-400">
          CRAKD AI
        </h1>

        <div className="w-[70px]" />
      </div>

      {/* CONTENT */}
      <div
        className={`flex flex-col items-center justify-center flex-1 w-full max-w-3xl px-4 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >

        {/* IMAGE */}
        {image?.url && (
          <img
            src={image.url}
            className="w-full max-h-[50vh] object-contain mb-6 rounded-xl"
          />
        )}

        {/* CAPTION */}
        <p className="text-xl md:text-2xl font-semibold text-center mb-8 px-4">
          {caption.content}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-8 w-full">

          {/* NOT FUNNY */}
          <button
            onClick={() => handleVote(-1)}
            className="px-8 py-4 rounded-xl bg-zinc-800 hover:bg-red-600 hover:scale-105 active:scale-95 transition"
          >
            {notFunnyEmoji} Not Funny
          </button>

          {/* FUNNY */}
          <button
            onClick={() => handleVote(1)}
            className="px-8 py-4 rounded-xl bg-zinc-800 hover:bg-green-600 hover:scale-105 active:scale-95 transition"
          >
            {funnyEmoji} Funny
          </button>

        </div>
      </div>

      {/* REACTION ANIMATION */}
      {reaction && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-7xl animate-bounce">
            {reaction === "lol" ? funnyEmoji : notFunnyEmoji}
          </div>
        </div>
      )}
    </main>
  );
}