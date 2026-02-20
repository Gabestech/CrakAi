//----minimal render code--------------
// export default function AdminPage() {
//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//     </div>
//   )
// }
//-----minimal render code end here--------------
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Tab = 'engagement' | 'power' | 'moderation' | 'trending' | 'flavors' |'promptTester'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('engagement')

  const renderContent = () => {
    switch (activeTab) {
      case 'engagement':
          return <EngagementPanel />
      case 'power':
        return <PowerUsersPanel />
      case 'moderation':
        return <ModerationPanel />
      case 'trending':
        return <TrendingPanel />
      case 'flavors':
          return <HumorFlavorsPanel />
      case 'promptTester':
          return <PromptTesterPanel />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 text-black relative overflow-hidden">

      {/* Stainless overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('/metal-texture.png')] bg-cover pointer-events-none" />

      <div className="relative z-10 px-8 py-10">

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-widest text-teal-500">
          ADMIN CONTROL PANEL
        </h1>

        {/* Angled Nav */}
        <div className="mt-8 flex space-x-6">
          {[
            { key: 'engagement', label: 'Engagement' },
            { key: 'power', label: 'Power Users' },
            { key: 'moderation', label: 'Moderation' },
            { key: 'trending', label: 'Trending' },
            { key: 'flavors', label: 'Flavors' },
            { key: 'promptTester', label: 'Prompt Tester' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`
                relative px-6 py-3 font-semibold uppercase tracking-wider
                transform -skew-x-12
                transition-all duration-300
                ${
                  activeTab === tab.key
                    ? 'bg-teal-500 text-black shadow-lg'
                    : 'bg-zinc-600 text-white hover:bg-teal-400'
                }
              `}
            >
              <span className="block skew-x-12">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="mt-12 bg-white/70 backdrop-blur-md border border-zinc-500 p-8 rounded-lg shadow-xl">
          {renderContent()}
        </div>

      </div>
    </main>
  )
}


//engagement tab----
function EngagementPanel() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: userCount },
        { count: captionCount },
        { count: reportCount },
        { data: likesData },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('captions').select('*', { count: 'exact', head: true }),
        supabase.from('reported_captions').select('*', { count: 'exact', head: true }),
        supabase.from('caption_likes').select('caption_id'),
      ])

      const avgLikes =
        captionCount && captionCount > 0
          ? (likesData?.length || 0) / captionCount
          : 0

      setStats({
        users: userCount || 0,
        captions: captionCount || 0,
        reports: reportCount || 0,
        avgLikes: avgLikes.toFixed(2),
      })
    }

    fetchStats()
  }, [])

  if (!stats) {
    return <div className="text-teal-500">Loading engagement metrics...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Users" value={stats.users} />
      <StatCard label="Total Captions" value={stats.captions} />
      <StatCard label="Total Reports" value={stats.reports} />
      <StatCard label="Avg Likes / Caption" value={stats.avgLikes} pink />
    </div>
  )
}

function StatCard({
  label,
  value,
  pink,
}: {
  label: string
  value: string | number
  pink?: boolean
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-zinc-500 p-6 rounded-lg shadow-lg">
      <div className="text-sm uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div
        className={`mt-4 text-3xl font-bold ${
          pink ? 'text-pink-500' : 'text-teal-500'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

//Powwer users tab------------------------------------------------
function PowerUsersPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPowerUsers = async () => {
      const { data: captions } = await supabase
        .from('captions')
        .select('profile_id, like_count')

      if (!captions) {
        setLoading(false)
        return
      }

      // Aggregate caption count + total likes per user
      const aggregation: Record<string, { captionCount: number; totalLikes: number }> = {}

      captions.forEach((c: any) => {
        if (!aggregation[c.profile_id]) {
          aggregation[c.profile_id] = {
            captionCount: 0,
            totalLikes: 0,
          }
        }

        aggregation[c.profile_id].captionCount += 1
        aggregation[c.profile_id].totalLikes += Number(c.like_count || 0)
      })

      const sorted = Object.entries(aggregation)
        .sort((a, b) => b[1].captionCount - a[1].captionCount)
        .slice(0, 5)

      const topIds = sorted.map(([id]) => id)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', topIds)

      const result = sorted.map(([id, stats]) => {
        const profile = profiles?.find((p: any) => p.id === id)

        return {
          id,
          name: profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'Unknown User',
          captionCount: stats.captionCount,
          totalLikes: stats.totalLikes,
        }
      })

      setUsers(result)
      setLoading(false)
    }

    fetchPowerUsers()
  }, [])

  if (loading) {
    return <div className="text-teal-500">Loading power users...</div>
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-zinc-500 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-teal-500 mb-6 uppercase tracking-widest">
        Top Caption Creators
      </h2>

      <div className="space-y-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex justify-between items-center border-b border-zinc-400 pb-3"
          >
            <div>
              <div className="text-zinc-800 font-semibold">
                {index + 1}. {user.name}
              </div>
              <div className="text-xs text-zinc-500">
                {user.totalLikes} total likes
              </div>
            </div>

            <div className="text-pink-500 font-bold">
              {user.captionCount} captions
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
//-------Moderation Tab--------------------------------------
function ModerationPanel() {
  const [reported, setReported] = useState<any[]>([])
  const [downvoted, setDownvoted] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModerationData = async () => {

      // ------------------------
      // MOST REPORTED
      // ------------------------
      const { data: reports } = await supabase
        .from('reported_captions')
        .select('caption_id')

      const reportCounts: Record<string, number> = {}

      reports?.forEach((r: any) => {
        reportCounts[r.caption_id] =
          (reportCounts[r.caption_id] || 0) + 1
      })

      const sortedReports = Object.entries(reportCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      const reportIds = sortedReports.map(([id]) => id)

      const { data: reportCaptions } = await supabase
        .from('captions')
        .select('id, content')
        .in('id', reportIds)

      const reportedResult = sortedReports.map(([id, count]) => {
        const cap = reportCaptions?.find((c: any) => c.id === id)
        return {
          id,
          content: cap?.content || 'Missing',
          count,
        }
      })

      // ------------------------
      // MOST DOWNVOTED
      // ------------------------
      const { data: votes } = await supabase
        .from('caption_votes')
        .select('caption_id, vote_value')

      const downvoteCounts: Record<string, number> = {}

      votes?.forEach((v: any) => {
        if (v.vote_value < 0) {
          downvoteCounts[v.caption_id] =
            (downvoteCounts[v.caption_id] || 0) + 1
        }
      })

      const sortedDownvotes = Object.entries(downvoteCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      const downvoteIds = sortedDownvotes.map(([id]) => id)

      const { data: downvoteCaptions } = await supabase
        .from('captions')
        .select('id, content')
        .in('id', downvoteIds)

      const downvotedResult = sortedDownvotes.map(([id, count]) => {
        const cap = downvoteCaptions?.find((c: any) => c.id === id)
        return {
          id,
          content: cap?.content || 'Missing',
          count,
        }
      })

      setReported(reportedResult)
      setDownvoted(downvotedResult)
      setLoading(false)
    }

    fetchModerationData()
  }, [])

  const handleDelete = async (captionId: string) => {
    if (!confirm('Delete this caption permanently?')) return

    await supabase.from('captions').delete().eq('id', captionId)

    setReported(prev => prev.filter(c => c.id !== captionId))
    setDownvoted(prev => prev.filter(c => c.id !== captionId))
  }

  if (loading) {
    return <div className="text-teal-500">Loading moderation data...</div>
  }

  return (
    <div className="space-y-10">

      {/* MOST REPORTED */}
      <div className="bg-white/80 backdrop-blur-md border border-red-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4 uppercase tracking-widest">
          Most Reported
        </h2>

        {reported.map((cap) => (
          <div key={cap.id} className="mb-4 p-4 border border-red-200 rounded bg-red-50">
            <div className="flex justify-between items-center">
              <div className="text-red-600 font-bold">
                {cap.count} Reports
              </div>
              <button
                onClick={() => handleDelete(cap.id)}
                className="text-xs px-3 py-1 bg-black text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
            <div className="mt-2 text-zinc-800">
              {cap.content}
            </div>
          </div>
        ))}
      </div>

      {/* MOST DOWNVOTED */}
      <div className="bg-white/80 backdrop-blur-md border border-purple-300 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-purple-600 mb-4 uppercase tracking-widest">
          Most Downvoted
        </h2>

        {downvoted.map((cap) => (
          <div key={cap.id} className="mb-4 p-4 border border-purple-200 rounded bg-purple-50">
            <div className="flex justify-between items-center">
              <div className="text-purple-600 font-bold">
                {cap.count} Downvotes
              </div>
              <button
                onClick={() => handleDelete(cap.id)}
                className="text-xs px-3 py-1 bg-black text-white hover:bg-purple-600 transition"
              >
                Delete
              </button>
            </div>
            <div className="mt-2 text-zinc-800">
              {cap.content}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
//------------------Trending tab---------------------------------
function TrendingPanel() {
  const [captions, setCaptions] = useState<any[]>([])
  const [images, setImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch top captions from production
        const captionRes = await fetch(
          "https://secure.almostcrackd.ai/rest/v1/captions?select=id,content,like_count,image_id&order=like_count.desc",
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        )

        const captionData = await captionRes.json()

        // 2️⃣ Collect unique image IDs
        const uniqueImageIds = [
          ...new Set(captionData.map((c: any) => c.image_id)),
        ]

        // 3️⃣ Fetch corresponding image URLs
        const imageRes = await fetch(
          `https://secure.almostcrackd.ai/rest/v1/images?select=id,url&id=in.(${uniqueImageIds.join(",")})`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        )

        const imageData = await imageRes.json()

        const imageMap: Record<string, string> = {}
        imageData.forEach((img: any) => {
          imageMap[img.id] = img.url
        })

        setCaptions(captionData)
        setImages(imageMap)
        setLoading(false)
      } catch (err) {
        console.error("Trending fetch failed:", err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-teal-500">Loading live engagement...</div>
  }

  if (!captions.length) {
    return <div className="text-zinc-500">No trending data available.</div>
  }

  const champion = captions[0]

  // Aggregate image totals
  const imageTotals: Record<string, number> = {}
  captions.forEach((c: any) => {
    imageTotals[c.image_id] =
      (imageTotals[c.image_id] || 0) + Number(c.like_count)
  })

  const sortedImages = Object.entries(imageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="space-y-16">

      {/* DATA SOURCE BADGE */}
      <div className="text-xs uppercase tracking-widest text-zinc-500">
        Data Source: Production (Live Engagement)
      </div>

      {/* 🏆 PLATFORM CHAMPION */}
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-xl border shadow-xl text-center">
        <div className="text-sm uppercase tracking-widest text-teal-500 mb-3">
          🏆 Platform Champion
        </div>

        {images[champion.image_id] && (
          <img
            src={images[champion.image_id]}
            alt="Champion"
            className="w-full max-h-[600px] object-contain rounded-lg mb-6 bg-zinc-100"
          />
        )}

        <div className="text-4xl font-bold text-pink-500 mb-3">
          {champion.like_count} Likes
        </div>

        <div className="text-lg text-zinc-800">
          {champion.content}
        </div>
      </div>

      {/* 🖼 TOP CAPTION–IMAGE PAIRS */}
      <div>
        <h2 className="text-xl font-bold text-teal-500 mb-6 uppercase tracking-widest">
          Top Caption–Image Pairs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {captions.slice(1, 5).map((cap: any) => (
            <div
              key={cap.id}
              className="bg-white/80 p-4 rounded-lg border shadow"
            >
              {images[cap.image_id] && (
                <img
                  src={images[cap.image_id]}
                  alt="Trending Pair"
                  className="w-full max-h-[400px] object-contain rounded-lg mb-3 bg-zinc-100"
                />
              )}

              <div className="text-pink-500 font-bold mb-2">
                {cap.like_count} Likes
              </div>

              <div className="text-sm text-zinc-800">
                {cap.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 IMAGE ENGAGEMENT LEADERBOARD */}
      <div>
        <h2 className="text-xl font-bold text-teal-500 mb-6 uppercase tracking-widest">
          Image Engagement Leaderboard
        </h2>

        <div className="space-y-3">
          {sortedImages.map(([imageId, total], index) => (
            <div
              key={imageId}
              className="flex justify-between items-center bg-white/80 p-4 rounded border shadow"
            >
              <div className="flex items-center gap-4">
                {images[imageId] && (
                  <img
                    src={images[imageId]}
                    alt="Leaderboard"
                    className="w-20 h-20 object-contain bg-zinc-100 rounded"
                  />
                )}
                <div className="font-semibold text-zinc-800">
                  #{index + 1}
                </div>
              </div>

              <div className="text-pink-500 font-bold">
                {total} Total Likes
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
//----------flavors tab------------------------------------------
function HumorFlavorsPanel() {
  const [flavors, setFlavors] = useState<any[]>([])
  const [selectedFlavor, setSelectedFlavor] = useState<any | null>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [stepTypes, setStepTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)

    const { data: flavorData } = await supabase
      .from("humor_flavors")
      .select("*")
      .order("id")

    const { data: typeData } = await supabase
      .from("humor_flavor_step_types")
      .select("*")

    setFlavors(flavorData || [])
    setStepTypes(typeData || [])
    setLoading(false)
  }

  const loadSteps = async (flavorId: number) => {
    const { data } = await supabase
      .from("humor_flavor_steps")
      .select("*")
      .eq("humor_flavor_id", flavorId)
      .order("order_by")

    setSteps(data || [])
  }

  const updateFlavor = async () => {
    if (!selectedFlavor) return

    await supabase
      .from("humor_flavors")
      .update({
        description: selectedFlavor.description,
        slug: selectedFlavor.slug,
      })
      .eq("id", selectedFlavor.id)

    alert("Flavor updated")
  }

  const updateStep = async (step: any) => {
    await supabase
      .from("humor_flavor_steps")
      .update(step)
      .eq("id", step.id)

    alert("Step updated")
  }

  const deleteStep = async (id: number) => {
    await supabase
      .from("humor_flavor_steps")
      .delete()
      .eq("id", id)

    setSteps(steps.filter((s) => s.id !== id))
  }

  const moveStep = async (index: number, direction: number) => {
    const newSteps = [...steps]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newSteps.length) return

    const current = newSteps[index]
    const target = newSteps[targetIndex]

    await supabase
      .from("humor_flavor_steps")
      .update({ order_by: target.order_by })
      .eq("id", current.id)

    await supabase
      .from("humor_flavor_steps")
      .update({ order_by: current.order_by })
      .eq("id", target.id)

    loadSteps(selectedFlavor.id)
  }

  if (loading) {
    return <div>Loading flavors...</div>
  }

  return (
    <div className="flex gap-8">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-white/80 p-4 rounded border shadow">
      <button
        onClick={async () => {
          const slug = prompt("Enter new flavor slug:")
          if (!slug) return

          const { data } = await supabase
            .from("humor_flavors")
            .insert({
              slug,
              description: "",
            })
            .select()
            .single()

          if (data) {
            setFlavors([...flavors, data])
          }
        }}
        className="mb-4 bg-teal-600 text-white px-3 py-2 rounded w-full"
      >
        + Add Flavor
      </button>

        <h2 className="font-bold mb-4 text-teal-600">Flavors</h2>

        {flavors.map((flavor) => (
          <div
            key={flavor.id}
            onClick={() => {
              setSelectedFlavor(flavor)
              loadSteps(flavor.id)
            }}
            className={`cursor-pointer p-2 rounded ${
              selectedFlavor?.id === flavor.id
                ? "bg-teal-100 font-semibold"
                : "hover:bg-zinc-100"
            }`}

          >
            {flavor.slug}
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/3 bg-white/80 p-6 rounded border shadow">

        {!selectedFlavor && <div>Select a flavor</div>}

        {selectedFlavor && (
          <>
            <h2 className="text-xl font-bold mb-4">
              Editing: {selectedFlavor.slug}
            </h2>

            {/* Flavor Fields */}
            <div className="space-y-4 mb-8">
              <input
                value={selectedFlavor.slug}
                onChange={(e) =>
                  setSelectedFlavor({
                    ...selectedFlavor,
                    slug: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <textarea
                value={selectedFlavor.description || ""}
                onChange={(e) =>
                  setSelectedFlavor({
                    ...selectedFlavor,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <button
                onClick={updateFlavor}
                className="bg-teal-600 text-white px-4 py-2 rounded"
              >
                Save Flavor
              </button>
            </div>

            {/* Steps */}
            <h3 className="font-bold mb-4 text-teal-600">Steps</h3>

            <button
              onClick={async () => {
                if (!selectedFlavor) return

                const nextOrder =
                  steps.length > 0
                    ? Math.max(...steps.map((s) => s.order_by)) + 1
                    : 1

                const { data } = await supabase
                  .from("humor_flavor_steps")
                  .insert({
                    humor_flavor_id: selectedFlavor.id,
                    order_by: nextOrder,
                    humor_flavor_step_type_id: stepTypes[0]?.id,
                    llm_system_prompt: "",
                    llm_user_prompt: "",
                    description: "",
                  })
                  .select()
                  .single()

                if (data) {
                  setSteps([...steps, data])
                }
              }}
              className="mb-4 bg-teal-600 text-white px-3 py-2 rounded"
            >
              + Add Step
            </button>


            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border p-4 rounded bg-white shadow-sm"
                >
                  <div className="flex justify-between mb-2">
                     <strong>
                       Step {index + 1} (Order: {step.order_by})
                     </strong>

                    <div className="space-x-2">
                      <button
                        onClick={() => moveStep(index, -1)}
                        className="text-xs bg-zinc-200 px-2 py-1 rounded"
                      >
                        ↑
                      </button>

                      <button
                        onClick={() => moveStep(index, 1)}
                        className="text-xs bg-zinc-200 px-2 py-1 rounded"
                      >
                        ↓
                      </button>

                      <button
                        onClick={() => deleteStep(step.id)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <select
                    value={step.humor_flavor_step_type_id}
                    onChange={(e) =>
                      setSteps(
                        steps.map((s) =>
                          s.id === step.id
                            ? {
                                ...s,
                                humor_flavor_step_type_id: Number(e.target.value),
                              }
                            : s
                        )
                      )
                    }
                    className="w-full border p-2 rounded mb-2"
                  >
                    {stepTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.slug}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={step.llm_system_prompt || ""}
                    onChange={(e) =>
                      setSteps(
                        steps.map((s) =>
                          s.id === step.id
                            ? { ...s, llm_system_prompt: e.target.value }
                            : s
                        )
                      )
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <textarea
                    value={step.llm_user_prompt || ""}
                    onChange={(e) =>
                      setSteps(
                        steps.map((s) =>
                          s.id === step.id
                            ? { ...s, llm_user_prompt: e.target.value }
                            : s
                        )
                      )
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <button
                    onClick={() => updateStep(step)}
                    className="bg-teal-600 text-white px-3 py-1 rounded"
                  >
                    Save Step
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

//----------prompt tester for flavors-----------

function PromptTesterPanel() {
  const [flavors, setFlavors] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [selectedFlavor, setSelectedFlavor] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: flavorData } = await supabase
      .from("humor_flavors")
      .select("*")
      .order("id")

    const { data: imageData } = await supabase
      .from("images")
      .select("id, url")
      .eq("is_common_use", true)
      .limit(20)

    setFlavors(flavorData || [])
    setImages(imageData || [])
  }

  const generateCaptions = async () => {
    if (!selectedFlavor || !selectedImage) {
      setError("Please select both a flavor and an image.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult([])

      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token

      const res = await fetch(
        "https://api.almostcrackd.ai/pipeline/generate-captions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageId: selectedImage,
            humorFlavorId: selectedFlavor,
          }),
        }
      )

      if (!res.ok) {
        throw new Error(`Execution failed (Status ${res.status})`)
      }

      const dataResult = await res.json()
      setResult(dataResult)
    } catch (err: any) {
      setError(
        err.message.includes("504")
          ? "Execution timeout. Try a lighter flavor."
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      <div className="bg-white/80 p-6 rounded shadow border">
        <h2 className="text-xl font-bold text-teal-600 mb-4">
          Prompt Chain Tester
        </h2>

        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Flavor Select */}
          <div>
            <label className="block mb-2 font-semibold">Select Flavor</label>
            <select
              onChange={(e) => setSelectedFlavor(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Flavor --</option>
              {flavors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.slug}
                </option>
              ))}
            </select>
          </div>

          {/* Image Select */}
          <div>
            <label className="block mb-2 font-semibold">Select Image</label>
            <select
              onChange={(e) => setSelectedImage(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Image --</option>
              {images.map((img) => (
                <option key={img.id} value={img.id}>
                  {img.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateCaptions}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Running Prompt Chain..." : "Generate Captions"}
        </button>

        {error && (
          <div className="mt-4 text-red-600 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result.length > 0 && (
        <div className="bg-white/80 p-6 rounded shadow border">
          <h3 className="text-lg font-bold text-teal-600 mb-4">
            Generated Captions
          </h3>

          <div className="space-y-4">
            {result.map((cap: any) => (
              <div
                key={cap.id}
                className="bg-zinc-100 p-4 rounded border"
              >
                {cap.content || cap.caption}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}






