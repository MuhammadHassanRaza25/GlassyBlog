"use client";

import Image from "next/image";
import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function BlogCard({
  data,
  basePath = "blog",
  onDelete,
  searchTerm = "",
}) {
  const pathname = usePathname();
  const showButtons = pathname.startsWith("/my-blogs");

  let { _id: id, image, title, description, author, createdAt } = data;

  const handleDelete = () => {
    toast((t) => (
      <div className="text-white">
        <p className="font-semibold">Are you sure you want to delete?</p>

        <div className="flex justify-center gap-2 mt-3">
          {/* YES Button */}
          <button
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await toast.promise(
                  fetch(`/api/myblogs/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                  }).then((res) => {
                    if (!res.ok) throw new Error("Failed to delete");
                    return res;
                  }),
                  {
                    loading: "Deleting...",
                    success: "Blog deleted successfully!",
                    error: "Failed to delete blog.",
                  }
                );

                onDelete && onDelete(id);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Yes
          </button>

          {/* NO Button */}
          <button
            className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-white cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const highlightText = (text, search) => {
    if (!search) return text;
    const words = search
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    if (!words.length) return text;

    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-emerald-400 text-black font-semibold rounded px-1.5 mx-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Link href={`/${basePath}/${id}`}>
      <div
        key={id}
        className="relative w-80 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl duration-300 cursor-pointer group flex flex-col justify-between"
      >
        {/* Edit/Delete Buttons */}
        {showButtons && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <Link
              href={`/blog/edit/${id}`}
              className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white backdrop-blur-sm rounded-full cursor-pointer"
            >
              <FiEdit size={15} />
            </Link>
            <button
              className="p-1.5 bg-red-800 hover:bg-red-700 text-white rounded-full cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        )}

        {/* Image */}
        <div className="overflow-hidden rounded-t-2xl">
          <Image
            src={image?.url || "/images/cardimg.jpg"}
            width={800}
            height={192}
            alt="Blog Image"
            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <h2 className="text-white text-xl font-semibold mb-2 hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
            {highlightText((title || "Untitled Blog").slice(0, 70), searchTerm)}
          </h2>

          <p className="text-gray-300 text-sm mb-6 line-clamp-2">
            {highlightText(
              (
                description || "No description provided for this blog post."
              ).slice(0, 110),
              searchTerm
            )}
          </p>

          <div className="flex items-end justify-between mt-auto">
            <div className="flex items-center gap-3">
              <Image
                src={author?.avatar?.url || "/images/avatar.png"}
                width={40}
                height={40}
                alt="Blog Author"
                className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-white font-medium text-sm truncate">
                  {author.username || "Unknown Author"}
                </p>
                <p className="text-gray-400 text-xs">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            <button className="flex gap-3 items-center px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border bg-emerald-700/30 focus:outline-none focus:bg-emerald-700/40 hover:bg-emerald-700/40 border-emerald-500/50 hover:border-emerald-500 text-white rounded-full transition-all duration-300 cursor-pointer">
              Read More
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
