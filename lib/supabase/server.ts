/**
 * Supabase Server Client
 * Used for server-side operations in API routes and Server Components
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

/**
 * Create Supabase client for Server Components
 */
export function createServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

/**
 * Create Supabase client for API Route Handlers
 */
export function createRouteClient() {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
}

/**
 * Create Supabase admin client with service role key
 * WARNING: Only use server-side, never expose to client
 */
export function createServiceClient() {
  const { createClient } = require('@supabase/supabase-js')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service credentials')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
