import { ConnectDB } from "@/app/lib/dbConnect";
import UserModel from "@/app/lib/models/UserModel";
import { verifyUser } from "@/app/lib/verifyUser";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  await ConnectDB();
  
  const userObj = await verifyUser();
  // console.log("Check Verify User in Backend ==>", userObj);
  
  if (!userObj) {
    return NextResponse.json({ user: null, msg: "Not logged in" }, { status: 401 });
  }

  const user = await UserModel.findById(userObj._id).select("-password");
  return NextResponse.json({ user });
}
