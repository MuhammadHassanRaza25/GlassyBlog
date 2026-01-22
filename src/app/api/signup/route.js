import { ConnectDB } from "@/app/lib/dbConnect";
import UserModel from "@/app/lib/models/UserModel";
import bcrypt from "bcrypt";
import Joi from "joi";
import { NextResponse } from "next/server";

// Joi schema for data validation, make sure data keynames are same like this schema keynames //
const signupSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[\p{L}\p{N}_. ]+$/u)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{5,30}$"))
    .required(),
  avatar: Joi.object({
    url: Joi.string().uri(),
    public_id: Joi.string(),
  }).optional(),
  role: Joi.string().valid("user", "admin"),
});

export async function POST(request) {
  await ConnectDB();
  const newUserData = await request.json();
  const { error, value } = signupSchema.validate(newUserData); //ye check karega ke data exact signupSchema ki tarah hai ya nhi.
  // console.log("User Validated Data - Before Save ===>", value);

  if (error) {
    console.log("JOI ERROR ==>", error.message);
    return NextResponse.json(
      {
        data: null,
        msg: error.message,
      },
      { status: 400 }
    );
  }

  const findUser = await UserModel.findOne({ email: value.email }); //same email ka user le ao.
  if (findUser) {
    return NextResponse.json(
      {
        data: null,
        msg: "User exist with this email",
      },
      { status: 403 }
    );
  }

  // Coverting password into hash
  const hashedPassword = await bcrypt.hash(value.password, 12);
  value.password = hashedPassword;

  // Add user in DB
  const addUser = await new UserModel({ ...value, role: value.role || "user" });
  await addUser.save();
  // console.log("User Registered Successfully ===>", addUser);

  return NextResponse.json({
    data: addUser,
    msg: "User Registered Successfully",
  });
}
