import { ConnectDB } from "@/app/lib/dbConnect";
import BlogModel from "@/app/lib/models/BlogModel";
import UserModel from "@/app/lib/models/UserModel";
import { verifyUser } from "@/app/lib/verifyUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await ConnectDB();

    let user = await verifyUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { msg: "Failed to fetch data you are not admin" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit")) || 9, 1),
      100
    );

    const search = (searchParams.get("search") || "").trim();
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const words = search ? search.split(/\s+/).map(escapeRegex) : [];

    const query = words.length
      ? {
          $or: words.flatMap((word) => [
            { title: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
          ]),
        }
      : {};

    const total = await BlogModel.countDocuments(query);
    const blogs = await BlogModel.find(query)
      .populate("author", "username email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    console.log("Blogs Data For Admin ===>", blogs);

    return NextResponse.json({
      data: blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      msg: "Blogs Fetched Successfully",
    });
  } catch (err) {
    console.log("Error in fetching blogs:", err);
    return NextResponse.json(
      { msg: "Failed to fetch blogs", error: err.message },
      { status: 500 }
    );
  }
}
