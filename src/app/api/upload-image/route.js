import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ msg: "No file found" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "blog-images", // cloudinary folder-name
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // console.log("<=== Blog Image Uploaded ===>");
    // console.log("Blog Image URL ===>", uploadRes.secure_url);
    // console.log("Blog Image Public ID ===>", uploadRes.public_id);
    
    return NextResponse.json({
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      msg: "Image Uploaded",
    });
  } catch (error) {
    console.log("Upload Err:", error);
    return NextResponse.json(
      { msg: "Image upload failed", error: error.message },
      { status: 500 }
    );
  }
}
