"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 2000,
        style: {
          background: "rgba(16, 185, 129, 0.3)", 
          color: "#fff",
          fontWeight: "600",
          borderRadius: "9999px", 
          padding: "10px 20px",
          backdropFilter: "blur(8px)", 
          border: "1px solid rgba(16, 185, 129, 0.5)", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          textAlign: "start",
        },
      }}
    />
  );
}
