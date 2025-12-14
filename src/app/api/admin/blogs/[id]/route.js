import mongoose from "mongoose";
import BlogModel from "@/app/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/dbConnect";
import { verifyUser } from "@/app/lib/verifyUser";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ msg: "Invalid Blog ID" }, { status: 400 });
  }

  // Verify Admin
  const user = await verifyUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ msg: "You are not admin" }, { status: 403 });
  }

  try {
    const deleteBlog = await BlogModel.findByIdAndDelete(id);

    if (!deleteBlog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    // Delete Cloudinary image if exists
    if (deleteBlog.image?.public_id) {
      await cloudinary.uploader.destroy(deleteBlog.image.public_id);
    }

    console.log("Blog Deleted From Admin Successfully =====>", deleteBlog);

    return NextResponse.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
