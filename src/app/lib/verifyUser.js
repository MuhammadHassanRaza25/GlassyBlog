import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function verifyUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // console.log("verifyUser - accessToken exists ==>", !!accessToken); //if token exist true, else false
  // console.log("verifyUser - refreshToken exists ==>", !!refreshToken);

  // check access token 
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.AUTH_SECRET);
      // console.log("verifyUser - Access token valid - User ID ==>", decoded._id);
      return { _id: decoded._id, role: decoded.role };
    } catch (err) {
      // console.log("Access token expired or invalid:", err.message);
    }
  }

  // check refresh token 
  if (refreshToken) {
    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      // console.log("verifyUser - Refresh token valid - user ID ==>", decodedRefresh._id);

      // Generate new access token
      const newAccessToken = jwt.sign(
        { _id: decodedRefresh._id, role: decodedRefresh.role },
        process.env.AUTH_SECRET,
        { expiresIn: "15m" }
      );
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      // console.log("verifyUser - New access token generated and set");

      // Extend refresh token if near expiry (less than 1 day left)
      const timeLeft = decodedRefresh.exp * 1000 - Date.now();
      if (timeLeft < 24 * 60 * 60 * 1000) { // 1 day
        const newRefreshToken = jwt.sign(
          { _id: decodedRefresh._id },
          process.env.REFRESH_SECRET,
          { expiresIn: "15d" }
        );
        cookieStore.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 24 * 60 * 60,
        });
        // console.log("verifyUser - Refresh token extended");
      }

      return { _id: decodedRefresh._id, role: decodedRefresh.role };
    } catch (err) {
      // console.log("Refresh token expired - clearing cookies", err.message);
      cookieStore.set("accessToken", "", { expires: new Date(0), path: "/" });
      cookieStore.set("refreshToken", "", { expires: new Date(0), path: "/" });
      return null;
    }
  }

  // console.log("verifyUser - No valid tokens found, returning null");
  return null;
}
