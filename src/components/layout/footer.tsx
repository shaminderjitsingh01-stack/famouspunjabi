import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Famous<span className="text-amber-500">Punjabi</span>
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              The home of Punjabi entertainment.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Browse</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/movies" className="text-sm text-gray-400 hover:text-amber-500">Movies</Link></li>
              <li><Link href="/songs" className="text-sm text-gray-400 hover:text-amber-500">Songs</Link></li>
              <li><Link href="/artists" className="text-sm text-gray-400 hover:text-amber-500">Artists</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Discover</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/trending" className="text-sm text-gray-400 hover:text-amber-500">Trending</Link></li>
              <li><Link href="/search" className="text-sm text-gray-400 hover:text-amber-500">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">FamousPunjabi</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-amber-500">About</Link></li>
              <li><Link href="/submit" className="text-sm text-gray-400 hover:text-amber-500">Submit Content</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} FamousPunjabi.com &mdash; The home of Punjabi entertainment. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
