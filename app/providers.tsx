'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  isPending: boolean
  login: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>
  signup: (email: string, password: string) => ReturnType<typeof supabase.auth.signUp>
  logout: () => ReturnType<typeof supabase.auth.signOut>
}

const supabase = createClient()

const AuthContext = createContext<AuthContextType>({
  user: null,
  isPending: true,
  login: () => supabase.auth.signInWithPassword({ email: '', password: '' }),
  signup: () => supabase.auth.signUp({ email: '', password: '' }),
  logout: () => supabase.auth.signOut(),
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsPending(false)           // ← was missing in your new version
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signup = (email: string, password: string) =>
    supabase.auth.signUp({ email, password })

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, isPending, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)