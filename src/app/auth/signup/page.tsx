import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MediaBubble Client Portal</h1>
          <p className="mt-1 text-sm text-gray-500">Sign up using your company domain</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
