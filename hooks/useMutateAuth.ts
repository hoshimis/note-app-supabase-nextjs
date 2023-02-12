import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'

export const useMutationAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const reset = () => {
    setEmail('')
    setPassword('')
  }

  // ログインするときに処理
  const loginMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw new Error(error.message)
    },
    {
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )

  // 新しくユーザを登録する処理
  const registerMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw new Error(error.message)
    },
    {
      onError: (error: any) => {
        alert(error.message)
        reset()
      },
    }
  )
  return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  }
}
