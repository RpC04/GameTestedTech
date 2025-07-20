import Link from "next/link"
import Image from "next/image"
import ArticlesDropdown from "@/components/articles/articles-dropdown";
import { Search } from "lucide-react";

export function Header() {
  return (
    <div
      className="w-full border-b border-gray-800"
      style={{
        backgroundImage: 'url("/images/cyberpunk-header.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="bg-[#0f0f23] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/KyleLogoNoText.png"
                alt="Game Tested Tech Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-game-white text-sm font-bold hidden sm:inline">
                GAME
                <br />
                TESTED TECH
              </span>
            </Link>
          </div>
          <div className="relative flex-1 max-w-xl mx-8">
            <input
              type="text"
              className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700 rounded-full py-2 px-4 pr-10 text-white"
              placeholder="Search..."
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-game-white hover:text-game-cyan transition">
              Home
            </Link>
            <div className="relative">
              <ArticlesDropdown />
            </div>
            <Link href="/about" className="text-game-white hover:text-game-cyan transition">
              About Us
            </Link>
            <Link href="/contact" className="text-game-white hover:text-game-cyan transition">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
