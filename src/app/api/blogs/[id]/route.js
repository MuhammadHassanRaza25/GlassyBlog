import mongoose from "mongoose";
import BlogModel from "@/app/lib/models/BlogModel";
import { ConnectDB } from "@/app/lib/dbConnect";

export async function GET(request, { params }) {
  await ConnectDB()
  let { id } = await params;
  // console.log("Blog ID is here ===>", id);

  // Checking blog id is valid or not
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json(
      {
        data: null,
        msg: "Invalid Blog ID",
      },
      { status: 404 }
    );
  }

  try {
    let singleBlog = await BlogModel.findById(id).populate("author", "username avatar").lean();
    if (!singleBlog) {
      return Response.json(
        {
          data: null,
          msg: "Blog Not Exist",
        },
        { status: 404 }
      );
    }

    return Response.json({
      data: singleBlog,
      msg: "Blog Found",
    });
  } catch (error) {
    return Response.json(
      {
        data: null,
        msg: "server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
