'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [captions, setCaptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<
    "idle" | "uploading" | "registering" | "generating" | "done"
  >("idle");

  const getProgress = () => {
    switch (step) {
      case "uploading": return 33;
      case "registering": return 66;
      case "generating": return 90;
      case "done": return 100;
      default: return 0;
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaptions([]);
    setStep("idle");
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setCaptions([]);
      setStep("uploading");

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw new Error("Session expired");

      const token = data.session.access_token;

      const res = await fetch(
        "https://api.almostcrackd.ai/pipeline/generate-presigned-url",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contentType: file.type }),
        }
      );

      const { presignedUrl, cdnUrl } = await res.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setStep("registering");

      const register = await fetch(
        "https://api.almostcrackd.ai/pipeline/upload-image-from-url",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: cdnUrl,
            isCommonUse: false,
          }),
        }
      );

      const { imageId } = await register.json();

      setStep("generating");

      const capRes = await fetch(
        "https://api.almostcrackd.ai/pipeline/generate-captions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId }),
        }
      );

      const generated = await capRes.json();
      setCaptions(generated);
      setStep("done");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition text-sm"
        >
          ← Back
        </button>
      </div>

      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-amber-300">
          Caption Lab
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Upload an image and let the machine cook.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl bg-zinc-900 rounded-2xl p-6 shadow-xl flex gap-6">

        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-center">

          {!previewUrl && (
            <label className="cursor-pointer border-2 border-dashed border-zinc-600 rounded-xl p-10 text-center hover:border-amber-400 transition">
              <p className="text-zinc-400">Click to upload</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const f = e.target.files[0];
                    setFile(f);
                    setPreviewUrl(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          )}

          {previewUrl && (
            <img
              src={previewUrl}
              className="rounded-xl object-cover max-h-[400px]"
            />
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-5 py-2 bg-amber-400 text-black rounded hover:bg-amber-500 disabled:opacity-40"
            >
              {uploading ? "Processing..." : "Generate"}
            </button>

            {step === "done" && (
              <button
                onClick={reset}
                className="px-5 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
              >
                New Upload
              </button>
            )}
          </div>

          {/* PROGRESS BAR */}
          {step !== "idle" && (
            <div className="w-full mt-4">
              <div className="h-2 bg-zinc-700 rounded">
                <div
                  className="h-2 bg-amber-400 rounded transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col">

          <h2 className="text-lg mb-3 text-zinc-300">Captions</h2>

          {/* LOADING SHIMMER */}
          {uploading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-zinc-800 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          {/* CAPTIONS */}
          {!uploading && captions.length > 0 && (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 transition-opacity duration-500">
              {captions.slice(0, 4).map((c, i) => (
                <div
                  key={c.id}
                  className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 transition opacity-0 animate-fadeUp"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {c.content || c.caption}
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
}