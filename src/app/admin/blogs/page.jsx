"use client";

import { Table } from "antd";
import AdminLayout from "../components/AdminLayout";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import AdminSearch from "../components/AdminSearch";

export default function AllBlogs() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 5;
  const searchFromURL = searchParams?.get("search") || "";
  const [searchValue, setSearchValue] = useState(searchFromURL);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromURL);
  const [blogsData, setBlogsData] = useState({
    data: null,
    total: 0,
    totalPages: 0,
    page: 1,
    error: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();
  const controllerRef = useRef(null);

  const getHighlightedText = (text, search) => {
    if (!text) return "N/A";
    if (!search || !search.trim()) return text;

    const words = search
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-emerald-300 text-black font-semibold px-1 rounded mx-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Author",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
            <Image
              src={record?.author?.avatar?.url || "/images/avatar.png"}
              width={30}
              height={30}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span>{record?.author?.username}</span>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text) => getHighlightedText(text, debouncedSearch),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => getHighlightedText(text, debouncedSearch),
    },
    {
      title: "Published Date",
      key: "date",
      render: (_, record) => {
        const date = record?.createdAt;
        return date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";
      },
    },
    {
      title: "Delete Blog",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => handleDelete(record._id)}
          className="text-red-600 cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-md"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleDelete = (id) => {
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
                  fetch(`/api/admin/blogs/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                  }).then((res) => {
                    if (!res.ok) throw new Error("Failed to delete");
                    return res.json();
                  }),
                  {
                    loading: "Deleting...",
                    success: "Blog deleted successfully!",
                    error: "Failed to delete blog.",
                  }
                );

                // Remove deleted blog from blogsData
                setBlogsData((prev) => {
                  const newData = prev.data.filter((blog) => blog._id !== id);
                  const newTotal = prev.total - 1;
                  const newTotalPages = Math.ceil(newTotal / limit);

                  return {
                    ...prev,
                    data: newData,
                    total: newTotal,
                    totalPages: newTotalPages,
                  };
                });
              } catch (err) {
                console.log("Failed to delete blog!");
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

  useEffect(() => {
    setIsLoading(true);

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    const fetchBlogs = async () => {
      try {
        let res = await fetch(
          `/api/admin/blogs?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controllerRef.current.signal,
          }
        );
        let blogData = await res.json();
        setBlogsData(blogData);
        // console.log("Blogs Data Is Here ===>", blogData);
      } catch (err) {
        if (err.name === "AbortError") return;
        // console.log("Error in fetching blog data ===>", err);
        setBlogsData((prev) => ({
          ...prev,
          totalPages: 0,
          page: 1,
          error: true,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, limit, debouncedSearch]);

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

      router.replace(`/admin/blogs?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const handleTableChange = (page, pageSize) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);

    router.push(`/admin/blogs?${params.toString()}`);
  };

  useEffect(() => {
    if (!isLoading && blogsData?.data?.length === 0 && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      router.push(`/admin/blogs?${params.toString()}`);
    }
  }, [blogsData?.data?.length, currentPage, limit, debouncedSearch, isLoading]);

  return (
    <>
      <AdminLayout>
        <div className="mt-3 px-5 py-7 bg-emerald-300 rounded-xl shadow-lg">
          <h1 className="text-black text-2xl font-bold">
            Welcome To Blogs Page 👋
          </h1>
          <p className="mt-1">
            Efficiently manage users’ blogs across the GlassyBlog platform.
          </p>
        </div>

        {/* Search Input */}
        <AdminSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder={"Search blogs by title or description"}
        />

        {/* content */}
        <div className="mt-5 h-[70vh]">
          {blogsData?.data === null ? (
            <div className="h-96 mb-10 flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {blogsData?.error ? (
                <p className="text-red-400 text-center lg:text-base text-sm mt-5 mb-14">
                  Failed to fetch blogs data. Please try again later.
                </p>
              ) : blogsData?.data?.length > 0 ? (
                <Table
                  loading={isLoading}
                  columns={columns}
                  expandable={{
                    expandedRowRender: (record) => (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="p-1 text-sm font-semibold bg-emerald-100 text-gray-700 mb-2">
                          Author Details
                        </h3>
                        <div className="flex items-center gap-3 mt-3 mb-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
                            <Image
                              src={
                                record?.author?.avatar?.url ||
                                "/images/avatar.png"
                              }
                              width={40}
                              height={40}
                              alt="Author Avatar"
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {record?.author?.username || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {record?.author?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                        <h3 className="p-1 text-sm font-semibold bg-emerald-100 text-gray-700 mt-5 mb-2">
                          Blog Post Details
                        </h3>
                        <p>
                          <span className="font-semibold">Title:</span>{" "}
                          {getHighlightedText(record?.title, debouncedSearch) ||
                            "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {getHighlightedText(
                            record?.description,
                            debouncedSearch
                          ) || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Published:</span>{" "}
                          {record?.createdAt
                            ? new Date(record.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </p>

                        <p>
                          <span className="font-semibold">Link:</span>{" "}
                          <Link
                            href={`/blog/${record?._id}`}
                            className="text-emerald-600 hover:underline"
                            target="_blank"
                          >
                            View Blog Post
                          </Link>
                        </p>
                      </div>
                    ),
                    rowExpandable: () => true,
                  }}
                  dataSource={blogsData?.data?.map((blog) => ({
                    key: blog?._id,
                    ...blog,
                  }))}
                  pagination={{
                    current: currentPage,
                    pageSize: limit,
                    total: blogsData?.total,
                    onChange: handleTableChange,
                  }}
                />
              ) : (
                <div className="text-center mt-10 mb-14 text-emerald-500">
                  {debouncedSearch ? (
                    <>
                      <p>
                        No results found for{" "}
                        <strong>"{debouncedSearch}"</strong>.
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try using different keywords or check your spelling.
                      </p>
                    </>
                  ) : (
                    <p className="text-emerald-500 text-center mt-10 mb-14">
                      Blogs data not available.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
