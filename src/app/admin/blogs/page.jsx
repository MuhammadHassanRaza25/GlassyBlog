"use client";

import { Table } from "antd";
import AdminLayout from "../components/AdminLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AllBlogs() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 5;
  const [blogsData, setBlogsData] = useState({
    data: [],
    totalPages: 0,
    page: 1,
    error: false,
  });
  const [isLoading, setIsLoading] = useState(true);

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
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
          : "Oct 10, 2025";
      },
    },
    {
      title: "Delete Blog",
      key: "action",
      render: (_, record) => (
        <a onClick={() => console.log("Delete blog", record.key)}>Delete</a>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const fetchBlogs = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        let res = await fetch(
          `${baseUrl}/api/admin/blogs?page=${page}&limit=${limit}`,
          { cache: "no-store" }
        );
        let blogData = await res.json();
        setBlogsData(blogData);
        console.log("Blogs Data Is Here ===>", blogData);
      } catch (err) {
        console.log("Error in fetching blog data ===>", err);
        setBlogsData({ data: [], totalPages: 0, page: 1, error: true });
      }
    };

    fetchBlogs();
    setIsLoading(false);
  }, [blogsData.page]);

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
        {/* content */}
        <div className="mt-10 h-[70vh]">
          {isLoading ? (
            <div className="h-40 mb-10 flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {blogsData.error ? (
                <p className="text-red-400 text-center lg:text-base text-sm mt-5 mb-14">
                  Failed to fetch user blogs. Please try again later.
                </p>
              ) : blogsData.data.length > 0 ? (
                <Table
                  columns={columns}
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
                        <h1 className="font-semibold text-lg mb-2">
                          Blog Post Details
                        </h1>
                        <h1>
                          <span className="font-semibold">Title:</span>{" "}
                          {record.title}
                        </h1>
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {record.description}
                        </p>
                        <p>
                          <span className="font-semibold">Published Date:</span>{" "}
                          {record?.createdAt
                            ? new Date(record.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Oct 10, 2025"}
                        </p>
                      </>
                    ),
                    rowExpandable: (record) => record.name !== "Not Expandable",
                  }}
                  dataSource={blogsData.data.map((blog) => ({
                    key: blog._id,
                    ...blog,
                  }))}
                  pagination={{
                    current: blogsData.page,
                    pageSize: limit,
                    total: blogsData.total,
                    onChange: (newPage) =>
                      setBlogsData((prev) => ({ ...prev, page: newPage })),
                  }}
                />
              ) : (
                <p className="text-emerald-400 text-center mt-10 mb-14">
                  Blogs data not available.
                </p>
              )}
            </>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
