import Hero from "@/components/Hero";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import BlogCard from "./components/BlogCard";
import { MotionUp } from "@/components/ui/motion-up";
import BlogsPagination from "./components/BlogPagination";
import { FaSearch } from "react-icons/fa";

export default async function Home({ searchParams }) {
  let params = await searchParams;
  let resData = { data: [], totalPages: 0, page: 1 };

  const page = parseInt(params?.page) || 1;
  const limit = parseInt(params?.limit) || 9;

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/blogs?page=${page}&limit=${limit}`,
      { cache: "no-store" }
    );
    resData = await res.json();
  } catch (err) {
    console.log("Error fetching blogs:", err);
    resData = { data: [], totalPages: 0, page, error: true };
  }

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

      {/* Search Input */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <MotionUp delay={0.1}>
          <div className="group relative w-fit mx-auto">
            <FaSearch
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2
               text-emerald-300 text-sm z-20"
            />
            <input
              type="text"
              placeholder="Search blog posts"
              className="z-10 pr-5 pl-10 lg:w-96 md:w-80 w-72 px-5 py-2 rounded-full backdrop-blur-sm bg-emerald-700/30 border border-emerald-500/50 focus:border-emerald-500 text-white placeholder-white/70 focus:outline-none hover:bg-emerald-700/40 focus:bg-emerald-700/40 transition-all duration-300"
            />

            {/* underline glow — focus only */}
            <span
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2
               w-0 h-px
               bg-gradient-to-r from-transparent via-emerald-400 to-transparent
               transition-all duration-300
               group-focus-within:w-3/4"
            />
          </div>
        </MotionUp>
      </div>

      <div className="mt-14 mb-10 flex flex-wrap gap-5 justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {resData.error ? (
          <p className="text-red-400 text-center lg:text-base text-sm ml-5 mt-5 mb-14">
            Failed to fetch blogs. Please try again later.
          </p>
        ) : resData.data && resData.data.length > 0 ? (
          resData.data.map((blog, index) => (
            <MotionUp key={blog._id} delay={index * 0.1}>
              <BlogCard data={blog} />
            </MotionUp>
          ))
        ) : (
          <p className="text-emerald-400 text-center ml-5 mt-10 mb-14">
            No blogs available.
          </p>
        )}
      </div>

      {/* Pagination Component */}
      {!resData.error && resData.data.length > 0 && (
        <div className="flex justify-center mt-6 max-w-5xl mx-auto">
          <BlogsPagination
            page={resData.page}
            limit={limit}
            total={resData.total}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
