"use client";

import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IoFileTrayStacked } from "react-icons/io5";
import { FaUsers, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";
import { HiHome } from "react-icons/hi2";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);

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
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const SidebarContent = (
    <>
      {/* Avatar + Dropdown */}
      <div
        className={`pt-5 text-xl font-bold text-center border-b border-white/30 transition-all duration-200 overflow-hidden 
          ${isDropdownOpen ? "pb-5" : "pb-0"} ${!isSidebarOpen && "pb-5"}`}
      >
        {user && (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`rounded-full overflow-hidden border-2 border-emerald-500 focus:outline-none cursor-pointer mx-auto transition-all duration-300
              ${isSidebarOpen ? "w-14 h-14" : "w-10 h-10"}`}
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
              className={`${
                isSidebarOpen
                  ? "mt-4 mx-auto"
                  : "absolute left-20 top-3 -translate-y-0 w-56"
              } w-52 border border-emerald-500/50 rounded-lg shadow-lg z-50 overflow-hidden transform transition-all duration-300 ease-in-out ${
                isDropdownOpen
                  ? "max-h-96 opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-95"
              }`}
            >
              <div className="details-scrollbar text-start px-4 py-3 border-b border-emerald-500/50 bg-black overflow-auto">
                <p className="text-white font-semibold text-sm">
                  {user?.username}
                </p>
                <p className="text-emerald-300 text-sm">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="group relative flex items-center justify-center gap-2 text-base w-full px-4 py-2 font-semibold text-white bg-emerald-700/30 border-b border-emerald-500/50 rounded-b-lg transition-all duration-300 hover:bg-emerald-700/40 hover:border-emerald-500 focus:outline-none cursor-pointer"
              >
                {isLoading ? <div className="formLoader"></div> : "Logout"}
                {/* Underline on hover */}
                <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col mt-10 px-3 gap-5">
        <Link
          href="/admin"
          className={`flex gap-2 items-center w-full py-2 font-semibold ${
            pathname === "/admin"
              ? "bg-emerald-700/40 border-l-4 border-emerald-500 text-emerald-300"
              : "border-l-4 border-transparent text-white"
          }  ${
            isSidebarOpen ? "px-4" : "justify-center px-0"
          } bg-emerald-700/30 hover:bg-emerald-700/40 mx-auto text-center rounded-lg transition-all duration-300 cursor-pointer`}
        >
          <HiHome />
          {isSidebarOpen && <span className="ml-2">Home</span>}
        </Link>

        <Link
          href="/admin/blogs"
          className={`flex gap-2 items-center w-full py-2 font-semibold ${
            pathname === "/admin/blogs"
              ? "bg-emerald-700/40 border-l-4 border-emerald-500 text-emerald-300"
              : "border-l-4 border-transparent text-white"
          } ${
            isSidebarOpen ? "px-4" : "justify-center px-0"
          } bg-emerald-700/30 hover:bg-emerald-700/40  mx-auto text-center rounded-lg transition-all duration-300 cursor-pointer`}
        >
          <IoFileTrayStacked />
          {isSidebarOpen && <span className="ml-2">Blogs</span>}
        </Link>

        <Link
          href="/admin/users"
          className={`flex gap-3 items-center w-full py-2 font-semibold ${
            pathname === "/admin/users"
              ? "bg-emerald-700/40 border-l-4 border-emerald-500 text-emerald-300"
              : "border-l-4 border-transparent text-white"
          } ${
            isSidebarOpen ? "px-4" : "justify-center px-0"
          } bg-emerald-700/30 hover:bg-emerald-700/40  mx-auto text-center rounded-lg transition-all duration-300 cursor-pointer`}
        >
          <FaUsers />
          {isSidebarOpen && <span className="ml-2">Users</span>}
        </Link>
      </nav>

      {/* Sidebar Toggle */}
      {isMobileSidebarOpen ? (
        <div className="hidden mx-3 mt-auto mb-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex justify-center w-full px-4 py-2.5 font-semibold border bg-emerald-700/30 border-emerald-500/50 text-white mx-auto text-center rounded-lg transition-all duration-300 cursor-pointer"
          >
            {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
      ) : (
        <div className="mx-3 mt-auto mb-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex justify-center w-full px-4 py-2.5 font-semibold border bg-emerald-700/30 border-emerald-500/50 text-white mx-auto text-center rounded-lg transition-all duration-300 cursor-pointer"
          >
            {isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col ${
          isSidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div className="relative w-64 flex flex-col bg-black">
          {SidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-2 left-2 z-50 cursor-pointer md:hidden p-2 rounded-md bg-black/50 text-white focus:outline-none"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
      </button>

      {/* Page Content */}
      <div className="w-screen h-scressn px-5 bg-gray-100 overflow-y-scroll">{children}</div>
    </div>
  );
}
