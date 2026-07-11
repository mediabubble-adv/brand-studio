import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">MediaBubble Brand Studio</h1>
        <p className="mt-2 text-gray-500">Agency content management platform</p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link href="/auth/login" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
