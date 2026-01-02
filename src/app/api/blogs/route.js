import { verifyUser } from "@/app/lib/verifyUser";
import { ConnectDB } from "../../lib/dbConnect";
import BlogModel from "@/app/lib/models/BlogModel";
import UserModel from "@/app/lib/models/UserModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Joi from "joi";

export async function GET(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit")) || 9, 1),
      100
    );

    const search = (searchParams.get("search") || "").trim();

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const query = search
      ? {
          $or: [
            { title: { $regex: escapeRegex(search), $options: "i" } },
            { description: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    const total = await BlogModel.countDocuments(query);
    const blogs = await BlogModel.find(query)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    console.log("Blogs From MongoDB ===>", blogs);

    return NextResponse.json({
      data: blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      msg: "Blogs Fetched Successfully.",
    });
  } catch (err) {
    console.log("Error fetching blogs:", err);
    return NextResponse.json(
      { msg: "Failed to fetch blogs", error: err.message },
      { status: 500 }
    );
  }
}

const blogSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  image: Joi.object({
    url: Joi.string().uri(),
    public_id: Joi.string(),
  }).optional(),
});

export async function POST(request) {
  try {
    await ConnectDB();
    const blog = await request.json();
    console.log("checking data in backend before post ===>", blog);

    const { error } = blogSchema.validate(blog);
    if (error) {
      console.log("JOI ERROR IN POST ==>", error.message);
      return NextResponse.json(
        {
          data: null,
          msg: error.message,
        },
        { status: 400 }
      );
    }

    const userObj = await verifyUser();
    if (!userObj) {
      return NextResponse.json(
        { msg: "User not logged in or session expired" },
        { status: 401 }
      );
    }

    const addBlog = await new BlogModel({
      ...blog,
      author: new mongoose.Types.ObjectId(userObj._id),
    });
    await addBlog.save();

    console.log("Blog Added Successfully ===>", addBlog);

    return NextResponse.json({
      data: addBlog,
      msg: "Blog Added Successfully",
    });
  } catch (err) {
    console.error("Error adding blog ==>", err);
    return NextResponse.json({ msg: "Error In Adding Blog" }, { status: 500 });
  }
}
