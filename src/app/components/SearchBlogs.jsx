"use client";
import { MotionUp } from "../../components/ui/motion-up";
import { FaSearch } from "react-icons/fa";

export default function SearchBlogs({ searchValue, onSearchChange }) {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <MotionUp delay={0.1}>
          <div className="group relative w-fit mx-auto">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 text-sm z-20" />
            <input
              type="text"
              placeholder="Search blog posts"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="z-10 pr-5 pl-10 lg:w-96 md:w-80 w-72 px-5 py-2 rounded-full backdrop-blur-sm bg-emerald-700/30 border border-emerald-500/50 focus:border-emerald-500 text-white placeholder-white/70 focus:outline-none hover:bg-emerald-700/40 focus:bg-emerald-700/40 transition-all duration-300"
            />

            {/* underline glow — focus only */}
            <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-focus-within:w-3/4" />
          </div>
        </MotionUp>
      </div>
    </>
  );
}
