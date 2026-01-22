import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json({ msg: "No public_id provided" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    // console.log("Image Deleted ===>", result);
    
    return NextResponse.json({
      msg: "Image deleted",
      result
    });

  } catch (err) {
    return NextResponse.json(
      { msg: "Failed to delete image", error: err.message },
      { status: 500 }
    );
  }
}