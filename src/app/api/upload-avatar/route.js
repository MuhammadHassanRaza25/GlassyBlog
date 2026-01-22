import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ msg: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "avatar-images",
            resource_type: "image",
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        )
        .end(buffer);
    });

    // console.log("<=== Avatar Image Uploaded ===>");
    // console.log("Avatar Image URL ===>", result.secure_url);
    // console.log("Avatar Image Public ID ===>", result.public_id);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      msg: "Avatar Uploaded",
    });
  } catch (err) {
    console.log("Avatar Upload Error ==>", err);
    return NextResponse.json(
      { msg: "Avatar upload failed", error: err.message },
      { status: 500 }
    );
  }
}
