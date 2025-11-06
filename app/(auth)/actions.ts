'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createRouteClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createRouteClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createRouteClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://2-set-method-tracker.vercel.app'}/login`,
    },
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Create user profile in users table
  if (authData.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: authData.user.email!,
      full_name: data.options.data.full_name,
    })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
    }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = createRouteClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPasswordRequest(formData: FormData) {
  const supabase = createRouteClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/confirm`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = createRouteClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resendConfirmationEmail(formData: FormData) {
  const supabase = createRouteClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://2-set-method-tracker.vercel.app'}/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
