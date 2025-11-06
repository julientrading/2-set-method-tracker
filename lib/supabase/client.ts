/**
 * Supabase Client (Browser)
 * Used for client-side operations in React components
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createClientComponentClient<Database>()
}

export const supabase = createClient()
