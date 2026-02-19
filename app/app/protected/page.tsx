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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [boothError, setBoothError] = useState<string | null>(null);

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

        useEffect(() => {
          const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            console.log("SESSION:", data.session);
          };

          checkSession();
        }, []);

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
      {/* THE BOOTH */}
      <div className="mt-20 w-full max-w-2xl border-t border-zinc-700 pt-10">
        <h2 className="text-3xl text-amber-300 tracking-widest">
          THE BOOTH
        </h2>

        <p className="text-sm text-zinc-400 mt-2">
          Upload an image. Let the machine judge it.
        </p>

        <input
          type="file"
          accept="image/*"
          className="mt-6 block w-full text-sm text-zinc-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-amber-300 file:text-black
                     hover:file:bg-amber-400"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        {file && (
          <p className="mt-4 text-zinc-400 text-sm">
            Selected: {file.name}
          </p>
        )}
        <button
          disabled={!file || uploading}
          onClick={async () => {
            if (!file) return;

            try {
              setUploading(true);
              setBoothError(null);

              const { data, error } = await supabase.auth.getSession();

              if (error || !data.session) {
                throw new Error("Session expired — please log in again");
              }

              const token = data.session.access_token;

              if (!token) {
                throw new Error("No auth token found");
              }

              const response = await fetch(
                "https://api.almostcrackd.ai/pipeline/generate-presigned-url",
                {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    contentType: file.type,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to generate presigned URL");
              }

              const result = await response.json();
              console.log("PRESIGNED RESPONSE:", result);
              const { presignedUrl, cdnUrl } = result;

              // STEP 2 — Upload Image Bytes
              const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                headers: {
                  "Content-Type": file.type,
                },
                body: file,
              });

              if (!uploadResponse.ok) {
                throw new Error("Failed to upload image to storage");
              }
              console.log("FILE TYPE:", file.type);
              console.log("FILE SIZE:", file.size / 1024 / 1024, "MB");
              console.log("UPLOAD SUCCESS");
              console.log("CDN URL:", cdnUrl);

              // STEP 3 — Register image with pipeline
              const registerResponse = await fetch(
                "https://api.almostcrackd.ai/pipeline/upload-image-from-url",
                {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    imageUrl: cdnUrl,
                    isCommonUse: false,
                  }),
                }
              );

              if (!registerResponse.ok) {
                throw new Error("Failed to register image with pipeline");
              }

              const registerResult = await registerResponse.json();
              console.log("REGISTER RESPONSE:", registerResult);

              const imageId = registerResult.imageId;

              //Wait 2 seconds before requesting captions
              await new Promise(resolve => setTimeout(resolve, 5000));

              console.log("IMAGE ID BEFORE CAPTION CALL:", imageId);
              console.log("FINAL BODY SENT TO CAPTION:", { imageId });
              // STEP 4 — Generate captions
              console.log("TOKEN BEING USED:", token);
              const captionResponse = await fetch(
                "https://api.almostcrackd.ai/pipeline/generate-captions",
                {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    imageId: imageId,
                  }),
                }
              );

              if (!captionResponse.ok) {
                throw new Error("Failed to generate captions");
              }

              const generated = await captionResponse.json();
              console.log("CAPTIONS:", generated);
              setCaptions(generated);

            } catch (err: any) {
              console.error(err);
              setBoothError(err.message);
            } finally {
              setUploading(false);
            }
          }}
          className="mt-6 px-6 py-3 bg-amber-400 text-black font-semibold rounded hover:bg-amber-500 disabled:opacity-40"
        >
          {uploading ? "Processing..." : "Generate Captions"}
        </button>
        {boothError && (
          <p className="mt-4 text-red-400 text-sm">
            {boothError}
          </p>
        )}
        {captions.length > 0 && (
          <div className="mt-8 space-y-4">
            {captions.map((cap) => (
              <div
                key={cap.id}
                className="bg-zinc-800 p-4 rounded-lg border border-amber-500/30"
              >
                <p className="text-lg text-amber-100">
                  {cap.content || cap.caption}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </main>
  );
}

