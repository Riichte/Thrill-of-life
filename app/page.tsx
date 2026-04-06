export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Riichte Site</h1>
        <div className="space-x-4">
          <a href="/auth/login" className="px-4 py-2 bg-blue-500 text-white rounded">
            Login
          </a>
          <a href="/auth/signup" className="px-4 py-2 bg-green-500 text-white rounded">
            Signup
          </a>
        </div>
      </div>
    </div>
  )
}
