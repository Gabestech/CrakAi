//----------OG Style----------------------------
// import Image from "next/image";
//
// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
//--------------Part1 hello World-----------------------------
// export default function Home() {
//   return <h1>Hello World</h1>;
//}
//-------------------Part2 MK1-------------------------------
// import { supabase } from "@/lib/supabaseClient";
//
// type NewsSnippet = {
//   id: number;
//   headline: string;
//   category: string | null;
//   source_url: string | null;
//   priority: number | null;
// };
//
// export default async function Home() {
//   const { data, error } = await supabase
//     .from("news_snippets")
//     .select("id, headline, category, source_url, priority")
//     .eq("is_active", true)
//     .order("priority", { ascending: false });
//
//   if (error) {
//     return (
//       <main style={{ padding: 24 }}>
//         <h1>Error loading news</h1>
//         <pre>{error.message}</pre>
//       </main>
//     );
//   }
//
//   return (
//     <main style={{ padding: 24 }}>
//       <h1>News Snippets</h1>
//
//       <ul>
//         {data?.map((item: NewsSnippet) => (
//           <li key={item.id} style={{ marginBottom: 16 }}>
//             <strong>{item.headline}</strong>
//             {item.category && <div>Category: {item.category}</div>}
//             {item.source_url && (
//               <a href={item.source_url} target="_blank" rel="noopener noreferrer">
//                 Read source
//               </a>
//             )}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
//----------Part2 MK2----------------------
// 'use client';
//
// import LoginButton from './LoginButton';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from "@/lib/supabaseClient";
//
// type NewsSnippet = {
//   id: number;
//   headline: string;
//   category: string | null;
//   source_url: string | null;
//   priority: number | null;
// };
//
// export default async function Home() {
//   const { data, error } = await supabase
//     .from("news_snippets")
//     .select("id, headline, category, source_url, priority")
//     .eq("is_active", true)
//     .order("priority", { ascending: false });
//
//   if (error) {
//     return (
//       <main className="min-h-screen bg-zinc-100 p-8">
//         <h1 className="text-2xl font-bold text-red-600">
//           Error loading news
//         </h1>
//         <pre className="mt-4 text-sm text-zinc-700">{error.message}</pre>
//       </main>
//     );
//   }
//
//   return (
//     <main className="min-h-screen bg-zinc-100">
//       {/* Header */}
//       <header className="bg-black text-white py-12 px-6 text-center">
//         <h1 className="text-5xl font-extrabold tracking-tight">
//           Crak’d News
//         </h1>
//         <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
//           Curated headlines pulled live from Supabase — real data, real deployment.
//         </p>
//         <LoginButton />
//       </header>
//
//       {/* Content */}
//       <section className="max-w-4xl mx-auto px-6 py-12">
//         <ul className="space-y-6">
//           {data?.map((item: NewsSnippet) => (
//             <li
//               key={item.id}
//               className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <h2 className="text-xl font-semibold text-zinc-900">
//                 {item.headline}
//               </h2>
//
//               {item.category && (
//                 <span className="inline-block mt-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
//                   {item.category}
//                 </span>
//               )}
//
//               {item.source_url && (
//                 <div className="mt-4">
//                   <a
//                     href={item.source_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm font-medium text-indigo-600 hover:underline"
//                   >
//                     Read full story →
//                   </a>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>
//     </main>
//   );
// }

//----------Part2 MK3----------------------
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoginButton from './LoginButton';

type NewsSnippet = {
  id: number;
  headline: string;
  category: string | null;
  source_url: string | null;
  priority: number | null;
};

const getYouTubeId = (url?: string | null) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );

  return match ? match[1] : null;
};


export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [news, setNews] = useState<NewsSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  // AUTH REDIRECT
//   useEffect(() => {
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_IN' && session) {
//         router.push('/protected');
//       }
//     });
//   return () => subscription.unsubscribe();
//   }, [router]);
//CHECK SESSION (NO REDIRECT)
    useEffect(() => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
      });
    }, []);



  // FETCH NEWS
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_snippets')
        .select('id, headline, category, source_url, priority')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setNews(data ?? []);
      }

      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading…
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 text-red-600">
        Error loading news: {error}
      </main>
    );
  }
const featured = news.length > 0 ? news[0] : null;
const rest = news.slice(1);
//----------MK1-----------------------------------
//   return (
//     <main className="min-h-screen bg-zinc-100">
//       <header className="bg-black text-white py-12 px-6 text-center">
//         <h1 className="text-5xl font-extrabold tracking-tight">
//           Crak’d News
//         </h1>
//         <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
//           Curated headlines pulled live from Supabase — real data, real deployment.
//         </p>
//          {/* 🔘 AUTH UI */}
//                 {!user ? (
//                   <LoginButton />
//                 ) : (
//                   <button
//                     onClick={() => router.push('/protected')}
//                     className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
//                   >
//                     Go to dashboard
//                   </button>
//                 )}
//
//
//       </header>
//
//       <section className="max-w-4xl mx-auto px-6 py-12">
//         <ul className="space-y-6">
//           {news.map((item) => (
//             <li
//               key={item.id}
//               className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <h2 className="text-xl font-semibold text-zinc-900">
//                 {item.headline}
//               </h2>
//
//               {item.category && (
//                 <span className="inline-block mt-2 text-xs font-medium uppercase tracking-wide text-indigo-600">
//                   {item.category}
//                 </span>
//               )}
//
//               {item.source_url && (
//                 <div className="mt-4">
//                   <a
//                     href={item.source_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm font-medium text-indigo-600 hover:underline"
//                   >
//                     Read full story →
//                   </a>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>
//     </main>
//   );
//--------------MK2----------------
return (
  <main className="min-h-screen bg-black text-white">
    {/* CHANNEL HEADER */}
    <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">
        CRAK’D NEWS <span className="text-red-500">LIVE</span>
      </h1>
      <LoginButton />
    </header>

    {/* FEATURED STORY */}
    {featured && (
     <div className="mb-2 flex items-center gap-3">
         <span className="relative flex h-3 w-3">
           <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
           <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
         </span>

         <span className="text-sm tracking-widest text-red-500 font-semibold">
           ON AIR
         </span>
       </div>


//         {getYouTubeId(featured.source_url) && (
//           <div className="mt-6 max-w-4xl">
//             <iframe
//               className="w-full aspect-video rounded-lg"
//               src={`https://www.youtube.com/embed/${getYouTubeId(
//                 featured.source_url
//               )}`}
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//             />
//           </div>
//         )}

    )}

    {/* HEADLINE FEED */}
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {rest.map((item) => (
          <li key={item.id} className="border-b border-zinc-800">
            {item.source_url ? (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-10 transition hover:bg-zinc-900"
              >
                <div className="space-y-2">
                  {item.category && (
                    <div className="text-xs tracking-widest text-zinc-500 uppercase">
                      {item.category}
                    </div>
                  )}

                  <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                    {item.headline}
                  </h2>

                  <div className="text-xs text-zinc-500">
                    {new URL(item.source_url).hostname.replace('www.', '')}
                  </div>
                </div>
              </a>
            ) : (
              <div className="py-10 opacity-40 cursor-not-allowed">
                <h2 className="text-2xl text-white">{item.headline}</h2>
              </div>
            )}
          </li>
        ))}
      </div>
      </section>
  </main>
);
}

