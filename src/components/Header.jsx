"use client";

import { AuthContext } from "@/app/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Header() {
  let router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { user, setUser } = useContext(AuthContext);

  let handleShowToast = (message) => {
    toast.error(message);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
      setUser(null);
      setIsLoading(false);
      setIsMenuOpen(false);

      if (pathname !== "/") {
        router.push("/");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const mobileAvatarRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Desktop
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !avatarRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }

      // Mobile
      if (
        mobileDropdownRef.current &&
        mobileAvatarRef.current &&
        !mobileDropdownRef.current.contains(e.target) &&
        !mobileAvatarRef.current.contains(e.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="font-bold text-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                GlassyBlog
              </h1>
            </Link>

            {/* Desktop Links*/}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className={`relative px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "text-emerald-400 font-bold"
                    : "text-gray-200 hover:text-emerald-400"
                }`}
              >
                Home
                {isActive("/") && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-800 rounded-full" />
                )}
              </Link>

              {user ? (
                <Link
                  href="/blog/create"
                  className={`relative px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${
                    isActive("/blog/create")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-200 hover:text-emerald-400"
                  }`}
                >
                  Create Blog
                  {isActive("/blog/create") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-800 rounded-full" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    handleShowToast("Please login to create a blog")
                  }
                  className={`relative px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${
                    isActive("/blog/create")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-200 hover:text-emerald-400"
                  }`}
                >
                  Create Blog
                  {isActive("/blog/create") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-800 rounded-full" />
                  )}
                </button>
              )}

              {user ? (
                <Link
                  href="/my-blogs"
                  className={`relative px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${
                    isActive("/my-blogs")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-200 hover:text-emerald-400"
                  }`}
                >
                  My Blogs
                  {isActive("/my-blogs") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-800 rounded-full" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    handleShowToast("Please login to see your blogs")
                  }
                  className={`relative px-3 py-2 cursor-pointer text-sm font-medium transition-all duration-300 ${
                    isActive("/my-blogs")
                      ? "text-emerald-400 font-bold"
                      : "text-gray-200 hover:text-emerald-400"
                  }`}
                >
                  My Blogs
                  {isActive("/my-blogs") && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-800 rounded-full" />
                  )}
                </button>
              )}
            </nav>

            {/* Login Button */}
            <div className="relative hidden md:block">
              {user ? (
                <>
                  {/* Avatar Button */}
                  <button
                    ref={avatarRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <Image
                      src={user?.avatar?.url || "/images/avatar.png"}
                      width={30}
                      height={30}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    ref={dropdownRef}
                    className={`absolute right-0 mt-2.5 w-52 border border-emerald-500/50 rounded-lg shadow-lg z-50 overflow-hidden transform transition-all duration-200 ease-in-out
                   ${
                     isDropdownOpen
                       ? "max-h-96 opacity-100 scale-y-100"
                       : "max-h-0 opacity-0 scale-y-95"
                   }`}
                  >
                    {/* {isDropdownOpen && ( */}
                    {/* <div className="absolute right-0 mt-2.5 w-52 border border-emerald-500/50 rounded-lg shadow-lg z-50 overflow-hidden"> */}
                    {/* Name & Email */}
                    <div className="details-scrollbar px-4 py-3 border-b border-emerald-500/50 bg-black overflow-auto">
                      <p className="text-white font-semibold text-sm">
                        {user?.username}
                      </p>
                      <p className="text-emerald-300 text-sm">{user?.email}</p>
                    </div>

                    {/* Logout Button */}
                    <button
                      disabled={isLoading}
                      onClick={handleLogout}
                      className="group relative flex items-center justify-center gap-2 w-full px-4 py-2 font-semibold text-white bg-emerald-700 backdrop-blur-sm border-b border-emerald-500/50 rounded-b-lg transition-all duration-300 hover:bg-emerald-800 hover:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="formLoader"></div>
                      ) : (
                        "Logout"
                      )}
                      {/* Underline on hover */}
                      <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
                    </button>
                  </div>
                  {/* )} */}
                  {/* </div> */}
                </>
              ) : (
                <Link href="/login">
                  <div className="group relative w-fit mx-auto cursor-pointer">
                    <button className="relative flex items-center px-6 py-2 text-sm font-medium text-white bg-emerald-700/30 border border-emerald-500/50 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-emerald-700/40 hover:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer">
                      Login
                      {/* Underline animation */}
                      <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
                    </button>
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-200 hover:text-emerald-400 focus:outline-none cursor-pointer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Links */}
        <div
          className={`md:hidden bg-black/60 backdrop-blur-md border-t border-white/10 overflow-hidden transition-all duration-200 ease-in-out
          ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive("/")
                  ? "text-emerald-400 font-bold bg-white/10"
                  : "text-gray-200 hover:text-emerald-400 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <Link
                href="/blog/create"
                className={`block px-3 py-2 cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive("/blog/create")
                    ? "text-emerald-400 font-bold bg-white/10"
                    : "text-gray-200 hover:text-emerald-400 hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Create Blog
              </Link>
            ) : (
              <button
                onClick={() => handleShowToast("Please login to create a blog")}
                className={`block px-3 py-2 w-full text-start cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive("/blog/create")
                    ? "text-emerald-400 font-bold bg-white/10"
                    : "text-gray-200 hover:text-emerald-400 hover:bg-white/5"
                }`}
              >
                Create Blog
              </button>
            )}

            {user ? (
              <Link
                href="/my-blogs"
                className={`block px-3 py-2 text-sm cursor-pointer font-medium rounded-lg transition-all duration-300 ${
                  isActive("/my-blogs")
                    ? "text-emerald-400 font-bold bg-white/10"
                    : "text-gray-200 hover:text-emerald-400 hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Blogs
              </Link>
            ) : (
              <button
                onClick={() =>
                  handleShowToast("Please login to see your blogs")
                }
                className={`block px-3 py-2 w-full text-start cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive("/my-blogs")
                    ? "text-emerald-400 font-bold bg-white/10"
                    : "text-gray-200 hover:text-emerald-400 hover:bg-white/5"
                }`}
              >
                My Blogs
              </button>
            )}

            <div className="relative px-3 py-2">
              {user ? (
                <>
                  {/* Avatar Button */}
                  <button
                    ref={mobileAvatarRef}
                    onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <Image
                      src={user?.avatar?.url || "/images/avatar.png"}
                      width={30}
                      height={30}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    ref={mobileDropdownRef}
                    className={`fixed top-20 right-10 w-52 border border-emerald-500/50 rounded-lg shadow-lg z-50 overflow-hidden transform transition-all duration-200 ease-in-out
                      ${
                        isMobileDropdownOpen
                          ? "max-h-96 opacity-100 scale-y-100"
                          : "max-h-0 opacity-0 scale-y-95"
                      }`}
                  >
                    {/* Name & Email */}
                    <div className="details-scrollbar px-4 py-3 border-b border-emerald-500/50 bg-black overflow-auto">
                      <p className="text-white font-semibold text-sm">
                        {user?.username}
                      </p>
                      <p className="text-emerald-300 text-sm">{user?.email}</p>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="group relative flex items-center justify-center gap-2 w-full px-4 py-2 font-semibold text-white bg-emerald-700 backdrop-blur-sm border-b border-emerald-500/50 rounded-b-lg transition-all duration-300 hover:bg-emerald-800 hover:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="formLoader"></div>
                      ) : (
                        "Logout"
                      )}
                      {/* Underline on hover */}
                      <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative block w-full text-center text-sm font-medium text-white bg-emerald-700/30 backdrop-blur-md border border-emerald-500/50 rounded-full px-4 py-2 transition-all duration-300 hover:bg-emerald-700/40 hover:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
                >
                  Login
                  {/* Underline on hover */}
                  <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
