"use client";

import { Table } from "antd";
import AdminLayout from "../components/AdminLayout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AllUsers() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get("page")) || 1;
  const limit = parseInt(searchParams?.get("limit")) || 10;

  const [usersData, setUsersData] = useState({
    data: [],
    total: 0,
    totalPages: 0,
    page: 1,
    error: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();

  console.log(usersData);

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
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      ellipsis: true,
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
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/admin/users?page=${currentPage}&limit=${limit}`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();
        setUsersData(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsersData({ data: [], totalPages: 0, page: 1, error: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, limit]);

  useEffect(() => {
    if (usersData.data.length === 0 && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      router.push(`/admin/users?page=${newPage}&limit=${limit}`);
    }
  }, [usersData.data.length, currentPage, limit]);

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

      <div className="mt-10 h-[70vh]">
        {isLoading ? (
          <div className="h-40 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : usersData.error ? (
          <p className="text-red-400 text-center mt-5 mb-14">
            Failed to fetch users data. Please try again later.
          </p>
        ) : usersData.data.length > 0 ? (
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <h3 className="p-1 text-sm font-semibold bg-emerald-100 text-gray-700 mb-2">
                    User Details
                  </h3>
                  <p>
                    <span className="font-semibold">Username:</span>{" "}
                    {record?.username || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {record?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span>{" "}
                    {record?.role || "N/A"}
                  </p>
                  <p>
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
            dataSource={usersData.data.map((user) => ({
              key: user._id,
              ...user,
            }))}
            pagination={{
              current: currentPage,
              pageSize: limit,
              total: usersData.total,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                router.push(`/admin/users?page=${page}&limit=${pageSize}`);
              },
            }}
          />
        ) : (
          <p className="text-emerald-400 text-center mt-10 mb-14">
            Users data not available.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
