import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/dbConnect";
import { verifyUser } from "@/app/lib/verifyUser";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "@/app/lib/models/UserModel";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  await ConnectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ msg: "Invalid User ID" }, { status: 400 });
  }

  // Verify Admin
  const user = await verifyUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ msg: "You are not admin" }, { status: 403 });
  }
  if (user._id.toString() === id) {
    return NextResponse.json(
      { msg: "Admin cannot delete own account" },
      { status: 400 }
    );
  }

  try {
    const deleteUser = await UserModel.findByIdAndDelete(id);

    if (!deleteUser) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // Delete Cloudinary image if exists
    if (deleteUser.avatar?.public_id) {
      await cloudinary.uploader.destroy(deleteUser.avatar.public_id);
    }

    console.log("User Deleted From Admin Successfully =====>", deleteUser);

    return NextResponse.json({ msg: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { msg: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
