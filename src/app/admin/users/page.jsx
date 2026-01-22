"use client";

import { Table } from "antd";
import AdminLayout from "../components/AdminLayout";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminSearch from "../components/AdminSearch";

export default function AllUsers() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 5;
  const searchFromURL = searchParams?.get("search") || "";
  const [searchValue, setSearchValue] = useState(searchFromURL);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromURL);
  const [usersData, setUsersData] = useState({
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
      title: "Profile Picture",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
            <Image
              src={record?.avatar?.url || "/images/avatar.png"}
              width={30}
              height={30}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      render: (text) => getHighlightedText(text, debouncedSearch),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      render: (text) => getHighlightedText(text, debouncedSearch),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      ellipsis: true,
      render: (role) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
            role === "admin"
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Registered Date",
      key: "createdAt",
      render: (_, record) =>
        new Date(record.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Delete User",
      key: "action",
      render: (_, record) =>
        record.role === "admin" ? null : (
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
          <button
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await toast.promise(
                  fetch(`/api/admin/users/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                  }).then((res) => {
                    if (!res.ok) throw new Error("Failed to delete");
                    return res.json();
                  }),
                  {
                    loading: "Deleting...",
                    success: "User deleted successfully!",
                    error: "Failed to delete user.",
                  }
                );

                setUsersData((prev) => {
                  const newData = prev.data.filter((user) => user._id !== id);
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
                console.error(err);
              }
            }}
          >
            Yes
          </button>

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

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/admin/users?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controllerRef.current.signal,
          }
        );
        const data = await res.json();
        setUsersData(data);
      } catch (err) {
        // console.error("Error fetching users:", err);
        if (err.name === "AbortError") return;
        setUsersData((prev) => ({
          ...prev,
          totalPages: 0,
          page: 1,
          error: true,
        }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
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

      router.replace(`/admin/users?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading && usersData?.data?.length === 0 && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      if (debouncedSearch) params.set("search", debouncedSearch);
      router.push(`/admin/users?${params.toString()}`);
    }
  }, [usersData?.data?.length, currentPage, limit]);

  return (
    <AdminLayout>
      <div className="mt-3 px-5 py-7 bg-emerald-300 rounded-xl shadow-lg">
        <h1 className="text-black text-2xl font-bold">
          Welcome To Users Page 👋
        </h1>
        <p className="mt-1">
          Efficiently manage users on the GlassyBlog platform.
        </p>
      </div>

      {/* Search Input */}
      <AdminSearch
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder={"Search users by username or email"}
      />

      <div className="mt-10 h-[70vh]">
        {usersData?.data === null ? (
          <div className="h-96 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : usersData?.error ? (
          <p className="text-red-400 text-center mt-5 mb-14">
            Failed to fetch users data. Please try again later.
          </p>
        ) : usersData?.data?.length > 0 ? (
          <Table
            loading={isLoading}
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <h3 className="p-1 text-sm font-semibold bg-emerald-100 text-gray-700 mb-2">
                    User Details
                  </h3>
                  <p className="mt-2">
                    <span className="font-semibold">Username:</span>{" "}
                    {getHighlightedText(record?.username, debouncedSearch) ||
                      "N/A"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {getHighlightedText(record?.email, debouncedSearch) ||
                      "N/A"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Role:</span>{" "}
                    {record?.role || "N/A"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Registered Date:</span>{" "}
                    {record?.createdAt
                      ? new Date(record.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </>
              ),
              rowExpandable: () => true,
            }}
            dataSource={usersData?.data?.map((user) => ({
              key: user?._id,
              ...user,
            }))}
            pagination={{
              current: currentPage,
              pageSize: limit,
              total: usersData?.total,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                const params = new URLSearchParams(searchParams);
                params.set("page", page.toString());
                params.set("limit", pageSize.toString());
                if (debouncedSearch) params.set("search", debouncedSearch);
                router.push(`/admin/users?${params.toString()}`);
              },
            }}
          />
        ) : (
          <div className="text-center mt-10 mb-14 text-emerald-500">
            {debouncedSearch ? (
              <>
                <p>
                  No results found for <strong>"{debouncedSearch}"</strong>.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Try using different keywords or check your spelling.
                </p>
              </>
            ) : (
              <p className="text-emerald-500 text-center mt-10 mb-14">
                Users data not available.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
