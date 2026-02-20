'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log('USER:', user)

      if (!user) {
        console.log('No user, redirecting')
        router.replace('/')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('id', user.id)
        .single()

      console.log('PROFILE:', profile)

      if (!profile || !profile.is_superadmin) {
        console.log('Not superadmin, redirecting')
        router.replace('/')
        return
      }

      setLoading(false)
    }

    checkAdmin()
  }, [router])


  if (loading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
