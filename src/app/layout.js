import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "./context/AuthContext";
import ToasterProvider from "@/components/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GlassyBlog",
  description:
    "GlassyBlog built by Muhammad Hassan Raza - Full Stack Developer, a full-featured blogging platform with a modern glassmorphic UI and robust architecture, empowering users to seamlessly create, manage, share and explore high-quality content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider>
          <ToasterProvider />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
