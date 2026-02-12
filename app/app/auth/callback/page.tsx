// import { supabase } from '@/lib/supabaseClient';
// import { redirect } from 'next/navigation';
//
// export default async function AuthCallback({
//   searchParams,
// }: {
//   searchParams: Promise<{ code?: string }>;
// }) {
//   const params = await searchParams;
//   const code = params.code;
//
//   if (!code) {
//     redirect('/');
//   }
//
//   const { error } = await supabase.auth.exchangeCodeForSession(code);
//
//   if (error) {
//     console.error('Auth callback error:', error.message);
//     redirect('/');
//   }
//
//   redirect('/protected');
// }
//-------MK2---------------------------

// import { redirect } from 'next/navigation';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
//
// export default async function AuthCallback({
//   searchParams,
// }: {
//   searchParams: Promise<{ code?: string }>;
// }) {
//   const { code } = await searchParams;
//
//   if (!code) {
//     redirect('/');
//   }
//
//   const cookieStore = await cookies();
//
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: (cookies) => {
//           cookies.forEach(({ name, value, options }) =>
//             cookieStore.set(name, value, options)
//           );
//         },
//       },
//     }
//   );
//
//   await supabase.auth.exchangeCodeForSession(code);
//
//   redirect('/protected');
// }

//-------MK3---------------------------
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { createServerClient } from '@supabase/ssr';
//
// type Props = {
//   searchParams: Promise<{ code?: string }>;
// };
//
// export default async function AuthCallback({ searchParams }: Props) {
//   const { code } = await searchParams;
//
//   if (!code) {
//     redirect('/');
//   }
//
//   const cookieStore = cookies();
//
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get: (name) => cookieStore.get(name)?.value,
//         set: (name, value, options) =>
//           cookieStore.set({ name, value, ...options }),
//         remove: (name, options) =>
//           cookieStore.set({ name, value: '', ...options }),
//       },
//     }
//   );
//
//   await supabase.auth.exchangeCodeForSession(code);
//
//   redirect('/protected');
// }

//-------MK3---------------------------
// supabase is implicit only
//
// 'use client';
//
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';
//
// export default function AuthCallback() {
//   const router = useRouter();
//
//   useEffect(() => {
//     const hash = window.location.hash;
//
//     if (!hash) {
//       router.replace('/');
//       return;
//     }
//
//     const params = new URLSearchParams(hash.replace('#', ''));
//
//     const access_token = params.get('access_token');
//     const refresh_token = params.get('refresh_token');
//
//     if (!access_token || !refresh_token) {
//       router.replace('/');
//       return;
//     }
//
//     supabase.auth
//       .setSession({
//         access_token,
//         refresh_token,
//       })
//       .then(() => {
//         router.replace('/protected');
//       });
//   }, [router]);
//
//   return (
//     <main className="min-h-screen flex items-center justify-center">
//       <p className="text-lg">Signing you in…</p>
//     </main>
//   );
// }
//-------------MK4--------------
// redirect only

import { redirect } from 'next/navigation';

export default function AuthCallback() {
  redirect('/protected');
}


