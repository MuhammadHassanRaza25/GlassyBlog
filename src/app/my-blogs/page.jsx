"use client";
import { useState, useEffect, useRef } from "react";
import BlogCard from "@/app/components/BlogCard";
import BlogsPagination from "@/app/components/BlogPagination";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MotionUp } from "@/components/ui/motion-up";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBlogs from "@/components/SearchBlogs";

export default function MyBlogs() {
  const searchParams = useSearchParams();
  const [resData, setResData] = useState({
    data: [],
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
          debouncedSearch
        )}`,
        {
          credentials: "include",
          cache: "no-cache",
          signal: controllerRef.current.signal,
        }
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
        {isLoading ? (
          <div className="h-40 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {resData.error ? (
              <p className="text-red-400 text-center lg:text-base text-sm mt-5 mb-14">
                Failed to fetch user blogs. Please try again later.
              </p>
            ) : resData.data.length > 0 ? (
              resData.data.map((blog, index) => (
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
                    <p>
                      No results found for <strong>"{debouncedSearch}"</strong>.
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Try using different keywords or check your spelling.
                    </p>
                  </>
                ) : (
                  <p className="text-emerald-400 text-center mt-10 mb-14">
                    No blogs available.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      <div
        className={`${
          resData.data.length > 0 ? "block" : "hidden"
        } flex justify-center mt-6 max-w-5xl mx-auto`}
      >
        <BlogsPagination
          page={resData.page}
          limit={limit}
          total={resData.total}
          basePath="my-blogs"
        />
      </div>

      <Footer />
    </>
  );
}
