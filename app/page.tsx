import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col text-center">
        <h1 className="text-6xl font-bold mb-8">YT Matcher</h1>
        <p className="text-xl mb-12 max-w-2xl text-gray-600">
          Welcome to YT Matcher - Your YouTube Video Matching Application. Connect brands and creators effortlessly.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard/brand"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Brand Dashboard
          </Link>
          <Link
            href="/dashboard/creator"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Creator Dashboard
          </Link>
        </div>

        <div className="mt-12 p-6 border rounded-xl bg-white max-w-xl">
          <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
          <p className="text-gray-500 mb-4">You must be logged in to view your dashboard. Create an account or sign in to continue.</p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
            <span>|</span>
            <Link href="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
