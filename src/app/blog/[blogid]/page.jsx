import BlogDetailCard from "@/app/components/BlogDetailCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { HiOutlineNewspaper } from "react-icons/hi2";

export default async function BlogDetailPage({ params }) {
  let { blogid } = await params;
  let blogData = null;
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/blogs/${blogid}`, {
      cache: "no-store",
    });
    const data = await res.json();
    blogData = data.data;
  } catch (err) {
    console.error("Error fetching blog:", err);
    blogData = null;
  }

  return (
    <>
      <Header />
      <div className="px-4 sm:px-6 lg:px-24">
        {blogData ? (
          <BlogDetailCard data={blogData} backUrl="/" />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl max-w-sm mx-auto mt-10 mb-10">
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-emerald-500/20 blur-2xl rounded-full" />

              <div className="relative p-5 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-inner">
                <HiOutlineNewspaper className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Post Not Found
            </h3>
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              The post you are looking for does not exist.
            </p>

            <div className="group relative w-fit mx-auto mt-5">
              <Link
                href="/"
                className="flex gap-3 items-center px-4 py-2 text-sm font-semibold backdrop-blur-md border bg-emerald-700/30 focus:outline-none focus:bg-emerald-700/40 hover:bg-emerald-700/40 border-emerald-500/50 hover:border-emerald-500 !text-white mx-auto text-center rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-900/20"
              >
                Back to Home
                <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-500 group-hover:w-3/4" />
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
