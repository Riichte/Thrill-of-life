export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Theme Park Review</h1>
        <p className="text-gray-400 text-center mb-12">Navigation Test Page</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme Parks Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Parks</h2>
            <ul className="space-y-2">
              <li>
                <a href="/parks" className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                  → All Parks
                </a>
              </li>
              <li>
                <a href="/parks/disneyland-paris" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  Disneyland Paris
                </a>
              </li>
              <li>
                <a href="/parks/universal-florida" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  Universal Studios Florida
                </a>
              </li>
              <li>
                <a href="/parks/six-flags-magic-mountain" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  Six Flags Magic Mountain
                </a>
              </li>
              <li>
                <a href="/parks/alton-towers" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  Alton Towers
                </a>
              </li>
              <li>
                <a href="/parks/port-adventure" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm">
                  PortAventura World
                </a>
              </li>
            </ul>
          </div>

          {/* Authentication Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">Authentication</h2>
            <ul className="space-y-2">
              <li>
                <a href="/auth/login" className="block px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/signup" className="block px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* User Area Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">User Area</h2>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Links Guide</h3>
          <p className="text-gray-300 text-sm">
            Use this page to navigate through all sections of the theme park review website. Click on any link to test the pages and their functionality. The site includes a parks listing with filters, individual park details, and item information with photos and videos.
          </p>
        </div>
      </div>
    </div>
  )
}
