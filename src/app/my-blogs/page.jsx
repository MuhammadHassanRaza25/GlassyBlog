"use client";
import { useState, useEffect, useRef } from "react";
import BlogCard from "@/app/components/BlogCard";
import BlogsPagination from "@/app/components/BlogPagination";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MotionUp } from "@/components/ui/motion-up";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBlogs from "@/app/components/SearchBlogs";
import Link from "next/link";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { FaPenNib, FaSearch } from "react-icons/fa";

export default function MyBlogs() {
  const searchParams = useSearchParams();
  const [resData, setResData] = useState({
    data: null,
    totalPages: 0,
    page: 1,
    error: false,
  });
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 9;
  const searchFromURL = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(searchFromURL);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromURL);
  const [isLoading, setIsLoading] = useState(true);
  const controllerRef = useRef(null);
  const router = useRouter();

  const fetchBlogs = async (fetchPage = page) => {
    setIsLoading(true);

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(
        `${baseUrl}/api/myblogs?page=${fetchPage}&limit=${limit}&search=${encodeURIComponent(
          debouncedSearch,
        )}`,
        {
          credentials: "include",
          cache: "no-cache",
          signal: controllerRef.current.signal,
        },
      );
      const data = await res.json();
      setResData(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.log("Error fetching my blogs:", err);
      setResData({ data: [], totalPages: 0, page: fetchPage, error: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchValue.trim();
      setDebouncedSearch(trimmed);

      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", limit);

      if (trimmed) params.set("search", trimmed);
      else params.delete("search");

      router.replace(`/my-blogs?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    fetchBlogs();
  }, [page, limit, debouncedSearch]);

  const handleDeleteFromChild = (id) => {
    setResData((prev) => {
      const newData = prev.data.filter((blog) => blog._id !== id);

      // agar page khali ho gaya aur page > 1
      if (newData.length === 0 && prev.page > 1) {
        const prevPage = prev.page - 1;
        router.replace(`/my-blogs?page=${prevPage}&limit=${limit}`);
        fetchBlogs(prevPage); // previous page load karo
        return { ...prev, page: prevPage, data: [] };
      }

      return { ...prev, data: newData };
    });
  };

  return (
    <>
      <Header />

      <MotionUp delay={0}>
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-md pt-18">
          <h1 className="font-semibold text-center lg:text-4xl md:text-2xl text-2xl text-white pb-4">
            My Blogs
          </h1>

          <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-2xl h-10 mx-auto">
            {/* Gradients */}
            <div className="absolute left-1/2 top-0 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-[2px] blur-sm" />
            <div className="absolute left-1/2 top-0 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
            <div className="absolute left-1/2 top-0 w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-[5px] blur-sm" />
            <div className="absolute left-1/2 top-0 w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />

            {/* Radial mask to smooth edges */}
            <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </MotionUp>

      <SearchBlogs searchValue={searchValue} onSearchChange={setSearchValue} />

      <div className="mt-14 mb-10 flex flex-wrap gap-5 justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading || resData?.data === null ? (
          <div className="h-40 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {resData?.error ? (
              <p className="text-red-400 text-center lg:text-base text-sm mt-5 mb-14">
                Failed to fetch user blogs. Please try again later.
              </p>
            ) : resData?.data?.length > 0 ? (
              resData?.data?.map((blog, index) => (
                <MotionUp key={blog._id} delay={index * 0.1}>
                  <BlogCard
                    data={blog}
                    searchTerm={debouncedSearch}
                    basePath="my-blogs"
                    onDelete={handleDeleteFromChild}
                  />
                </MotionUp>
              ))
            ) : (
              <div className="text-center mt-10 mb-14 text-emerald-400">
                {debouncedSearch ? (
                  <>
                    <MotionUp>
                      <div className="flex flex-col items-center justify-center gap-6 w-64 py-6 px-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden">
                        <div className="relative shrink-0 flex items-center justify-center">
                          <div className="absolute w-12 h-12 bg-emerald-500/20 blur-[35px] rounded-full" />
                          <div className="relative p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-inner">
                            <FaSearch className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />{" "}
                          </div>
                        </div>

                        <div className="text-center">
                          <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                            No Results Found
                          </h3>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            Nothing found for{" "}
                            <span className="text-emerald-400 font-medium italic">
                              "{debouncedSearch}"
                            </span>
                            . <br /> Try a different keyword.
                          </p>
                        </div>

                        {/* Clear Button */}
                        <button
                          onClick={() => setSearchValue("")}
                          className="shrink-0 px-4 py-2 text-xs font-semibold bg-emerald-700/30 hover:bg-emerald-700/40 text-white border border-emerald-500/50 hover:border-emerald-500 rounded-full transition-all duration-300 cursor-pointer"
                        >
                          Clear Search
                        </button>
                      </div>
                    </MotionUp>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-10 px-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl">
                    <div className="relative mb-8 flex items-center justify-center">
                      <div className="absolute w-24 h-24 bg-emerald-500/20 blur-[50px] rounded-full" />
                      <div className="relative p-5 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-inner">
                        <HiOutlineDocumentPlus className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      </div>
                    </div>

                    <h3 className="lg:text-2xl text-xl font-bold text-white mb-2 tracking-tight">
                      Ready to share your story?
                    </h3>
                    <p className="text-gray-400 text-center max-w-[300px] mb-10 leading-relaxed text-sm">
                      You haven't posted any blogs yet. Your creative journey
                      starts with your first post!
                    </p>

                    <div className="group relative w-fit mx-auto">
                      <Link
                        href="/blog/create"
                        className="flex gap-3 items-center px-6 py-3 font-semibold backdrop-blur-md border bg-emerald-700/30 focus:outline-none focus:bg-emerald-700/40 hover:bg-emerald-700/40 border-emerald-500/50 hover:border-emerald-500 !text-white mx-auto text-center rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-900/20"
                      >
                        Create Your First Blog <FaPenNib />
                        <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-500 group-hover:w-3/4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <div
        className={`${
          !isLoading && resData?.data?.length > 0 ? "block" : "hidden"
        } flex justify-center mt-6 max-w-5xl mx-auto`}
      >
        <BlogsPagination
          page={resData?.page}
          limit={limit}
          total={resData?.total}
          basePath="my-blogs"
        />
      </div>

      <Footer />
    </>
  );
}
