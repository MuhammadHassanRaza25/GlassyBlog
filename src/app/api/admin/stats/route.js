import { ConnectDB } from "@/app/lib/dbConnect";
import BlogModel from "@/app/lib/models/BlogModel";
import UserModel from "@/app/lib/models/UserModel";
import { verifyUser } from "@/app/lib/verifyUser";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    await ConnectDB();

    const user = await verifyUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: 403 }
      );
    }

    const totalUsers = await UserModel.countDocuments();
    const totalBlogs = await BlogModel.countDocuments();

    // Optional: users & blogs over time
    const usersOverTimeRaw = await UserModel.find().select("createdAt").lean();
    const blogsOverTimeRaw = await BlogModel.find().select("createdAt").lean();

    const aggregateByDate = (arr) => {
      const map = {};
      arr.forEach((item) => {
        const date = item.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
        map[date] = (map[date] || 0) + 1;
      });
      return Object.keys(map).map((date) => ({ date, count: map[date] }));
    };

    const usersOverTime = aggregateByDate(usersOverTimeRaw);
    const blogsOverTime = aggregateByDate(blogsOverTimeRaw);

    return NextResponse.json({
      totals: { totalUsers, totalBlogs },
      usersOverTime,
      blogsOverTime,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "Failed to fetch dashboard stats", error: err.message },
      { status: 500 }
    );
  }
}
