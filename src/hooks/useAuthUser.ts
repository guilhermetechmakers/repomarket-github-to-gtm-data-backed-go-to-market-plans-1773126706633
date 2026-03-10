import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User | null> => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    staleTime: 1000 * 60 * 5,
  })
}
