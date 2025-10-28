'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import nodemailer from 'nodemailer'

// Email sending using nodemailer with Gmail SMTP
async function sendEmail(userEmail: string, subject: string, html: string) {
  console.log('📧 Sending email to:', userEmail)
  console.log('📧 Subject:', subject)
  
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'casca.case@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD, // App password from Gmail
      },
    })

    // Send email
    const result = await transporter.sendMail({
      from: `"Casca Team" <${process.env.GMAIL_USER || 'casca.case@gmail.com'}>`,
      to: userEmail,
      subject: subject,
      html: html,
    })

    console.log('✅ Email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return false
  }
}

// Email templates
async function sendWelcomeEmail(userEmail: string, userName?: string) {
  try {
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #f97316; margin-bottom: 20px;">Welcome to Casca!</h1>
        <p style="font-size: 16px; line-height: 1.5;">Hi ${userName || userEmail.split('@')[0]},</p>
        <p style="font-size: 16px; line-height: 1.5;">
          Thanks for signing up with Casca! You can now create custom phone cases by uploading 
          your own images or using our AI generator.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Start designing your first case today!
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Happy designing,<br>
          The Casca Team
        </p>
      </div>
    `

    await sendEmail(userEmail, 'Welcome to Casca - Create Your First Custom Case!', welcomeHtml)
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }
}

async function sendLoginEmail(userEmail: string, userName?: string) {
  try {
    const loginHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #f97316; margin-bottom: 20px;">Welcome back to Casca!</h1>
        <p style="font-size: 16px; line-height: 1.5;">Hi ${userName || userEmail.split('@')[0]},</p>
        <p style="font-size: 16px; line-height: 1.5;">
          Great to see you again! Ready to create another amazing custom phone case?
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Browse your previous designs or start a new one today!
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Happy designing,<br>
          The Casca Team
        </p>
      </div>
    `

    await sendEmail(userEmail, 'Welcome back to Casca!', loginHtml)
  } catch (err) {
    console.error('Failed to send login email:', err)
  }
}

// Main auth callback function
export const getAuthStatus = async () => {
  console.log('🚀 Starting auth callback...')
  
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  console.log('👤 User data:', { 
    id: user?.id, 
    email: user?.email, 
    given_name: (user as any)?.given_name,
    family_name: (user as any)?.family_name 
  })

  if (!user?.id || !user.email) {
    console.error('❌ Invalid user data')
    throw new Error('Invalid user data')
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  })

  console.log('🔍 Existing user:', existingUser ? 'Found' : 'Not found')

  const userName = (user as any).given_name || (user as any).family_name

  if (!existingUser) {
    console.log('🆕 Creating new user...')
    // New user signup
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    })

    // Send welcome email for new signups
    console.log('📧 Sending welcome email...')
    await sendWelcomeEmail(user.email, userName)
  } else {
    console.log('🔄 Returning user, sending login email...')
    // Returning user login
    await sendLoginEmail(user.email, userName)
  }

  console.log('✅ Auth callback completed')
  return { success: true }
}
