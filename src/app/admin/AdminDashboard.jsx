import AdminLayout from "./components/AdminLayout";

export default function AdminDashboard() {
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
        {/* content */}
        <div className="mt-4 pl-3 flex justify-center items-center bg-amber-200">
          <p>Welcome To the Admin Dashboard!</p>
        </div>
      </AdminLayout>
    </>
  );
}
