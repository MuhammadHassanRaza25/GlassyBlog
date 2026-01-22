import mongoose from "mongoose";
import BlogModel from "@/app/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/dbConnect";
import { verifyUser } from "@/app/lib/verifyUser";
import Joi from "joi";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
  await ConnectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { data: null, msg: "Invalid Blog ID" },
      { status: 404 }
    );
  }

  try {
    const singleBlog = await BlogModel.findById(id)
      .populate("author", "username avatar")
      .lean();

    if (!singleBlog) {
      return NextResponse.json(
        { data: null, msg: "Blog Not Exist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: singleBlog, msg: "Blog Found" });
  } catch (error) {
    return NextResponse.json(
      { data: null, msg: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

const blogUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  image: Joi.object({
    url: Joi.string().uri(),
    public_id: Joi.string(),
  }).optional(),
});

export async function PUT(request, { params }) {
  await ConnectDB();
  const { id } = await params;
  const body = await request.json();

  // ID check
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ msg: "Invalid Blog ID" }, { status: 404 });
  }

  // Validation
  const { error } = blogUpdateSchema.validate(body);
  if (error) {
    console.log("JOI ERROR IN POST ==>", error.message);
    return NextResponse.json({ msg: error.message }, { status: 400 });
  }

  // Verify user
  const userObj = await verifyUser();
  if (!userObj) {
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
  }

  try {
    // Update only if user is author
    const updateBlog = await BlogModel.findOneAndUpdate(
      { _id: id, author: userObj._id },
      body,
      { new: true }
    );

    if (!updateBlog) {
      return NextResponse.json(
        { msg: "Blog not found or not authorized" },
        { status: 404 }
      );
    }

    // console.log("Blog Updated ===>", updateBlog);

    return NextResponse.json({ data: updateBlog, msg: "Blog updated" });
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ msg: "Invalid Blog ID" }, { status: 404 });
  }

  // Verify user
  const userObj = await verifyUser();
  if (!userObj) {
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
  }

  try {
    const deleteBlog = await BlogModel.findOneAndDelete({
      _id: id,
      author: userObj._id,
    });

    if (!deleteBlog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    // Delete Cloudinary image if exists
    if (deleteBlog.image?.public_id) {
      await cloudinary.uploader.destroy(deleteBlog.image.public_id);
    }

    // console.log("Blog Deleted Successfully =====>", deleteBlog);

    return NextResponse.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
