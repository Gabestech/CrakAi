// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { createServerClient } from '@supabase/ssr';
//
// export default async function ProtectedPage() {
//   const cookieStore = cookies();
//
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name) => cookieStore.get(name)?.value,
//       },
//     }
//   );
//
//   const { data } = await supabase.auth.getUser();
//
//   if (!data.user) {
//     redirect('/');
//   }
//
//   return (
//     <main className="min-h-screen p-12">
//       <h1 className="text-3xl font-bold">Protected Page</h1>
//       <p className="mt-4">You are signed in as {data.user.email}</p>
//     </main>
//   );
// }
//-----------MK2---------------

// import { redirect } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';
//
// export default async function ProtectedPage() {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//
//   if (!session) {
//     redirect('/');
//   }
//
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-zinc-100">
//       <div className="rounded-xl bg-white p-8 shadow-md text-center">
//         <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
//         <p className="text-zinc-600">
//           You are signed in as <strong>{session.user.email}</strong>
//         </p>
//       </div>
//     </main>
//   );
// }
//-------------------MK3-----------------

// Protected route: client-side auth guard using Supabase session
// 'use client';
//
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';
//
// export default function ProtectedPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [email, setEmail] = useState<string | null>(null);
//
//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//
//       if (!session) {
//         router.replace('/');
//         return;
//       }
//       window.history.replaceState({}, document.title, '/protected');
//       setEmail(session.user.email ?? null);
//       setLoading(false);
//     };
//
//     checkSession();
//   }, [router]);
//
//   if (loading) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         Loading protected content…
//       </main>
//     );
//   }
//
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
//       <h1 className="text-4xl font-bold">Protected Page</h1>
//
//       <p className="mt-4 text-zinc-300">
//         Signed in as <span className="font-mono">{email}</span>
//       </p>
//
//       <button
//         className="mt-8 rounded bg-white px-6 py-3 text-black font-semibold"
//         onClick={async () => {
//           await supabase.auth.signOut();
//           router.push('/');
//         }}
//       >
//         Sign out
//       </button>
//     </main>
//   );
// }
//---------------MK4----------------------------
// 'use client';
//
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';
//
// export default function ProtectedPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState<string | null>(null);
//
//   useEffect(() => {
//     const getUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//
//       if (error || !data.user) {
//         router.push('/');
//         return;
//       }
//
//       setEmail(data.user.email ?? null);
//     };
//
//     getUser();
//   }, [router]);
//
//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     router.push('/');
//   };
//
//   return (
//     <main className="min-h-screen bg-black text-white flex items-center justify-center">
//       <div className="text-center space-y-6">
//         <h1 className="text-4xl font-extrabold">Protected</h1>
//
//         <p className="text-zinc-300">
//           Signed in as{' '}
//           <span className="font-semibold text-white">
//             {email}
//           </span>
//         </p>
//
//         <div className="flex gap-4 justify-center">
//           <button
//             onClick={() => router.push('/')}
//             className="rounded-md bg-zinc-800 px-6 py-3 text-sm font-semibold hover:bg-zinc-700"
//           >
//             ← Back to Home
//           </button>
//
//           <button
//             onClick={handleSignOut}
//             className="rounded-md bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-500"
//           >
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }
//---------MK5--------------------------------
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import CaptionReel from './CaptionReel';
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push('/');
      } else {
        setUser(data.user);
      }

      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
      <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center px-6">
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className={`${playfair.className} text-5xl md:text-6xl text-amber-200 tracking-wide`}>
        GATED HUMOR LAB
      </h1>

      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-400">
        the speakeasy where humor gets judged
      </p>
      <div className="mt-6 w-24 h-[1px] bg-amber-400 opacity-50"></div>


      {user && <CaptionReel userId={user.id} />}
    </div>
    </main>
  );
}

