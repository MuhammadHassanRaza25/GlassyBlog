"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import BlogCard from "./components/BlogCard";
import { MotionUp } from "@/components/ui/motion-up";
import BlogsPagination from "./components/BlogPagination";
import SearchBlogs from "@/app/components/SearchBlogs";
import { HiOutlineNewspaper } from "react-icons/hi2";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState({
    data: null,
    total: 0,
    page: 1,
    error: false,
  });
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 9;
  const searchFromURL = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(searchFromURL);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromURL);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const router = useRouter();

  const fetchBlogs = async (pageNumber = 1, query = "") => {
    setLoading(true);

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(
        `${baseUrl}/api/blogs?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
          query,
        )}`,
        {
          credentials: "include",
          cache: "no-store",
          signal: controllerRef.current.signal,
        },
      );
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.log("Error fetching blogs:", err);
      setBlogs({ data: [], total: 0, page: 1, error: true });
    } finally {
      setLoading(false);
    }
  };

  // Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedSearch = searchValue.trim();
      setDebouncedSearch(trimmedSearch);

      // URL update with search + page reset
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", limit);
      if (trimmedSearch) params.set("search", trimmedSearch);
      else params.delete("search");

      router.replace(`/?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);

  // Fetch blogs with debounced search
  useEffect(() => {
    fetchBlogs(page, debouncedSearch);
  }, [page, debouncedSearch]);

  const goToPage = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage);
    params.set("limit", limit);
    if (debouncedSearch) params.set("search", debouncedSearch);
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <Hero />

      {/* Blog Posts Section */}
      <MotionUp delay={0}>
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-md pt-18">
          <h1 className="font-semibold text-center lg:text-4xl md:text-3xl text-3xl text-white pb-4">
            Insights & Stories
          </h1>

          <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-2xl h-10 mx-auto">
            {/* Gradients */}
            <div className="absolute left-1/2 top-0 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-[2px] blur-sm" />
            <div className="absolute left-1/2 top-0 w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
            <div className="absolute left-1/2 top-0 w-1/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-[5px] blur-sm" />
            <div className="absolute left-1/2 top-0 w-1/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />

            {/* Radial mask to smooth edges */}
            <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </MotionUp>

      <SearchBlogs searchValue={searchValue} onSearchChange={setSearchValue} />

      <div className="mt-14 mb-10 flex flex-wrap gap-5 justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading || blogs.data === null ? (
          <div className="h-40 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : blogs?.error ? (
          <p className="text-red-400 text-center lg:text-base text-sm mt-5 mb-14">
            Failed to fetch blogs. Please try again later.
          </p>
        ) : blogs?.data?.length > 0 ? (
          blogs?.data?.map((blog, index) => (
            <MotionUp key={blog?._id} delay={index * 0.1}>
              <BlogCard data={blog} searchTerm={debouncedSearch} />
            </MotionUp>
          ))
        ) : (
          <div className="text-center mt-10 mb-14 text-emerald-400">
            {debouncedSearch ? (
              <>
                <p>
                  No results found for <strong>"{debouncedSearch}"</strong>.
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  Try using different keywords or check your spelling.
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center w-full py-10 px-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl">
                  <div className="mb-5 flex items-center justify-center">
                    <div className="absolute w-24 h-24 bg-emerald-500/20 blur-[50px] rounded-full" />
                    <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-inner">
                      <HiOutlineNewspaper className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Feed is empty
                  </h3>
                  <p className="text-gray-400 text-sm">
                    No stories posted yet. Check back soon for fresh insights.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className={`${
          !loading && blogs?.data?.length > 0 ? "block" : "hidden"
        } flex justify-center mt-6 max-w-5xl mx-auto`}
      >
        <BlogsPagination
          page={page}
          limit={limit}
          total={blogs?.total}
          onPageChange={goToPage}
        />
      </div>

      <Footer />
    </>
  );
}
