import AdminLayout from "../components/AdminLayout";

export default function AllUsers() {
  return (
    <>
      <AdminLayout>
        <div className="mt-3 px-5 py-7 bg-emerald-300 rounded-xl shadow-lg">
          <h1 className="text-black text-2xl font-bold">
            Welcome To Users Page 👋
          </h1>
          <p className="mt-1">
            Efficiently manage users on the GlassyBlog platform.
          </p>
        </div>
        {/* content */}
        <div className="mt-4 pl-3 flex justify-center items-center bg-amber-200">
          <p>all users table</p>
        </div>
      </AdminLayout>
    </>
  );
}
