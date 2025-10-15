'use server'

import { firestoreService } from '@/lib/firestore'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('Invalid user data')
  }

  const existingUser = await firestoreService.getUser(user.id)

  if (!existingUser) {
    await firestoreService.createUser({
      id: user.id,
      email: user.email,
    })
  }

  return { success: true }
}
