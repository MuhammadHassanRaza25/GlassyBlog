"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaPenNib } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MotionUp } from "./ui/motion-up";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

export default function Hero() {
  const { user } = useContext(AuthContext);
  let showToast = () => {
    toast.error("Please login to create a blog");
  };

  return (
    <>
      <div className="relative">
        {/* Grid Background Layer */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        {/* Hero Content Div */}
        <div className="flex flex-col gap-5 items-center justify-center max-w-7xl mx-auto px-4 pt-20 pb-20 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex gap-2 mt-1 items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
            <span className="text-sm font-medium text-white drop-shadow-sm">
              Thoughts, Stories & Ideas
            </span>
            <HiOutlineLightBulb className="w-4 h-4 text-yellow-400 mr-2 drop-shadow-sm" />
          </div>

          {/* Heading and para */}
          <div className="flex flex-col items-center">
            <MotionUp delay={0.2}>
              <h1 className="lg:text-5xl md:text-3xl text-3xl font-semibold text-white text-center">
                Welcome to{" "}
                <span className="font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  GlassyBlog
                </span>
              </h1>
            </MotionUp>
            <MotionUp delay={0.3} className="w-full">
              <p className="lg:w-[70%] md:w-[70%] w-[100%] mx-auto lg:text-lg md:text-base text-sm text-center text-gray-100 mt-5">
                Every day brings a new story, a fresh perspective! Dive into our
                blogs to discover inspiring tips, heartfelt stories, and
                everything that fuels your passion to chase your dreams. Join us
                on this journey where every word is meant to touch your heart
                and spark your curiosity.
              </p>
            </MotionUp>
          </div>

          {/* Button */}
          {user ? (
            <Link href="/blog/create">
              <div className="group relative w-fit mx-auto">
                <button className="flex gap-3 items-center px-4 py-2 font-semibold backdrop-blur-sm border bg-emerald-700/30 focus:outline-none focus:bg-emerald-700/40 hover:bg-emerald-700/40 border-emerald-500/50 hover:border-emerald-500 text-white mx-auto text-center rounded-full transition-all duration-300 cursor-pointer">
                  Create Your Blog <FaPenNib />
                  <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
                </button>
              </div>
            </Link>
          ) : (
            <div className="group relative w-fit mx-auto">
              <button
                className="flex gap-3 items-center px-4 py-2 font-semibold backdrop-blur-sm border bg-emerald-700/30 focus:outline-none focus:bg-emerald-700/40 hover:bg-emerald-700/40 border-emerald-500/50 hover:border-emerald-500 text-white mx-auto text-center rounded-full transition-all duration-300 cursor-pointer"
                onClick={showToast}
              >
                Create Your Blog <FaPenNib />
                <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
