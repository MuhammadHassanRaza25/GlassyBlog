"use client";
import { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";

export default function AdminDashboard() {
  const [data, setData] = useState({
    totals: { totalUsers: 0, totalBlogs: 0 },
    usersOverTime: [],
    blogsOverTime: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // console.log("Stats Data ==>", data);

  return (
    <>
      <AdminLayout>
        <div className="mt-3 px-5 py-7 bg-emerald-300 rounded-xl shadow-lg">
          <h1 className="text-black text-2xl font-bold">
            Welcome To GlassyBlog Admin Dashboard 👋
          </h1>
          <p className="mt-1">
            Efficiently manage blogs and user operations across the GlassyBlog
            platform.
          </p>
        </div>
        {/* Charts */}
        {loading ? (
          <div className="h-96 mb-10 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex-1 min-w-[300px] bg-white p-4 rounded-xl shadow">
              <PieChart
                totalUsers={data.totals.totalUsers}
                totalBlogs={data.totals.totalBlogs}
              />
            </div>
            <div className="flex-1 min-w-[300px] bg-white p-4 rounded-xl shadow">
              <LineChart
                usersOverTime={data.usersOverTime}
                blogsOverTime={data.blogsOverTime}
              />
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
