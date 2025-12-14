import { ConnectDB } from "@/app/lib/dbConnect";
import UserModel from "@/app/lib/models/UserModel";
import { verifyUser } from "@/app/lib/verifyUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await ConnectDB();

    let user = await verifyUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { msg: "Failed to fetch users you are not admin" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit")) || 9, 1),
      100
    );

    const total = await UserModel.countDocuments();
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    console.log("Users Data For Admin ===>", users);

    return NextResponse.json({
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      msg: "Users Fetched Successfully",
    });
  } catch (err) {
    console.log("Error in fetching users:", err);
    return NextResponse.json(
      { msg: "Failed to fetch users", error: err.message },
      { status: 500 }
    );
  }
}
