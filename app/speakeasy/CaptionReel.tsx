'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Caption = {
  id: string;
  content: string;
   image_id: string;
    images?: { url: string } | { url: string }[];

};

export default function CaptionReel({ userId }: { userId: string }) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });
}, []);

useEffect(() => {
  const fetchCaptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // 🔥 get captions user already voted on
    const { data: votes } = await supabase
      .from('caption_votes')
      .select('caption_id')
      .eq('profile_id', user.id);

    const votedIds = votes?.map(v => v.caption_id) || [];

    // 🔥 fetch captions NOT in voted list
    const { data, error } = await supabase
      .from('captions')
      .select(`
        *,
        images ( url )
      `)
      .not('id', 'in', `(${votedIds.join(',') || 'null'})`);

    if (!error && data) {
     // console.log("FILTERED FIRST ITEM:", data[0]);

      const normalized = data.map((item) => ({
        ...item,
        images: Array.isArray(item.images)
          ? item.images[0]
          : item.images,
      }));

      const shuffled = normalized.sort(() => Math.random() - 0.5);
      setCaptions(shuffled);
    }

    setLoading(false);
  };

  fetchCaptions();
}, []);


const caption = captions[currentIndex];
const nextCaption = captions[currentIndex + 1];

const image = caption?.images
  ? Array.isArray(caption.images)
    ? caption.images[0]
    : caption.images
  : null;

  useEffect(() => {
    const nextImage = Array.isArray(nextCaption?.images)
        ? nextCaption?.images[0]
        : nextCaption?.images;

      if (nextImage?.url) {
        const img = new Image();
        img.src = nextImage.url;
      }
    }, [currentIndex]);
const [reaction, setReaction] = useState<"lol" | "meh" | null>(null);

  useEffect(() => {
    if (reaction) {
      const timer = setTimeout(() => {
        setReaction(null);
      }, 700); // adjust timing

      return () => clearTimeout(timer);
    }
  }, [reaction]);

const handleVote = async (value: number) => {
  setReaction(value === 1 ? "lol" : "meh");

  setVoting(true);

  // 🔥 ALWAYS GET USER FROM SUPABASE (not props)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("You must be logged in to vote");
    setVoting(false);
    return;
  }

  const caption = captions[currentIndex];

  const { data, error } = await supabase.from('caption_votes').insert({
    vote_value: value,
    profile_id: user.id,
    caption_id: caption?.id,

    // ✅ NEW REQUIRED FIELDS
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

//console.log("INSERT RESULT:", { data, error });


// 🔥 ADD THIS CHECK QUERY
const { data: checkData, error: checkError } = await supabase
  .from('caption_votes')
  .select('*')
  .order('created_datetime_utc', { ascending: false })
  .limit(3);

//console.log("LATEST ROWS AFTER INSERT:", checkData, checkError);

if (error) {
  const err = JSON.parse(JSON.stringify(error));

  // ✅ Handle duplicate vote (code 23505)
  if (err.code === "23505") {
    //console.log("User already voted — skipping insert");


    setVoting(false);
    setFade(false);

    setTimeout(() => {
      setCurrentIndex((prev) => {
        let next = prev + 1;

        const currentImageId = captions[prev]?.image_id;

        // skip same image_id
        while (
          next < captions.length &&
          captions[next]?.image_id === currentImageId
        ) {
          next++;
        }

        return next;
      });
      setFade(true);
    }, 500);

    return;
  }

  // ❌ Real error
  console.log("REAL ERROR:", err);
  alert("Error submitting vote");
  setVoting(false);
  return;
}

  setVoting(false);
  setFade(false);

  setTimeout(() => {
   setCurrentIndex((prev) => {
     let next = prev + 1;

     const currentImageId = captions[prev]?.image_id;

     // skip same image_id
     while (
       next < captions.length &&
       captions[next]?.image_id === currentImageId
     ) {
       next++;
     }

     return next;
   });
    setFade(true);
  }, 500);
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
return (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">

    {/* IMAGE */}
    {image?.url && (
      <img
        src={image.url}
        className="w-[350px] h-[350px] object-cover rounded-xl mb-6 shadow-xl"
      />
    )}

    {/* CAPTION */}
    <div className="max-w-xl bg-zinc-900 p-6 rounded-xl shadow-lg">
      <p className="text-2xl md:text-3xl font-semibold leading-relaxed">
        “{caption?.content}”
      </p>
    </div>

    {/* BUTTONS */}
    <div className="flex gap-6 mt-10">

      {/* NOT FUNNY */}
      <button
        disabled={voting || !user}
        onClick={() => handleVote(-1)}
        className={`px-8 py-4 rounded-xl text-white transition
          ${user
            ? "bg-zinc-800 hover:bg-red-600 hover:scale-105 active:scale-95"
            : "bg-zinc-700 opacity-50 cursor-not-allowed"
          }
          ${reaction === "meh" && user ? "animate-pulse" : ""}
        `}
      >
        👎 Not Funny
      </button>

      {/* FUNNY */}
      <button
        disabled={voting || !user}
        onClick={() => handleVote(1)}
        className={`px-8 py-4 rounded-xl text-white transition
          ${user
            ? "bg-zinc-800 hover:bg-green-600 hover:scale-105 active:scale-95"
            : "bg-zinc-700 opacity-50 cursor-not-allowed"
          }
          ${reaction === "lol" && user ? "animate-bounce" : ""}
        `}
      >
        😂 LOL
      </button>
    </div>
    {reaction && (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="text-7xl animate-bounce">
          {reaction === "lol" ? "😂" : "👎"}
        </div>
      </div>
    )}
  </div>
 );
}
