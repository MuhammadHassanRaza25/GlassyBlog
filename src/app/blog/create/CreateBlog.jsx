"use client";

import BlogEditor from "@/app/components/BlogEditor";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const formRef = useRef(null);
  const [loading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(formRef.current);
    const title = formData.get("title");
    // const description = formData.get("description");
    const imageFile = formData.get("image");
    let imageUrl = null;
    let imagePublicId = null;

    if (title.length > 100) {
      toast.error("title must be less than 100 characters");
      setIsLoading(false);
      return;
    }

    if (title.length < 3) {
      toast.error("title must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    if (description.length < 10) {
      toast.error("description must be at least 10 characters");
      setIsLoading(false);
      return;
    }

    if (imageFile && imageFile.size > 0) {
      try {
        const imgForm = new FormData();
        imgForm.append("file", imageFile);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: imgForm,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          toast.error("Image upload failed");
        }

        imageUrl = uploadData.url;
        imagePublicId = uploadData.public_id;
      } catch (err) {
        toast.error("Error uploading image. Try again later");
        setIsLoading(false);
        return;
      }
    }

    let obj = {
      title,
      description,
    };

    if (imageUrl && imagePublicId) {
      obj.image = {
        url: imageUrl,
        public_id: imagePublicId,
      };
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      let res = await fetch(`${baseUrl}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
        credentials: "include",
      });
      if (!res.ok) {
        const result = await res.json();
        const msg = result.msg;
        if (msg.includes("less")) {
          toast.error("title must be less than 100 characters");
        } else if (msg.includes("title")) {
          toast.error("title must be at least 3 characters");
        } else if (msg.includes("description")) {
          toast.error("description must be at least 10 characters");
        } else {
          toast.error(msg);
        }
        setIsLoading(false);
        return;
      }

      toast.success("Blog created successfully");
      setIsLoading(false);
      formRef.current?.reset();
      setDescription("");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("Error in adding blog ==>", err);
      setIsLoading(false);
      toast.error("Error in adding blog try again");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="flex flex-col lg:flex-row bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden">
          {/* create blog form */}
          <form
            ref={formRef}
            onSubmit={handleCreateBlog}
            className="w-full lg:w-1/2 p-8 flex flex-col gap-6"
          >
            {/* Background effect behind the form */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-gray-900/30 to-teal-900/30 -z-10">
              <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                Create a New Blog
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Share your thoughts with world. Fill out the form below to
                publish your blog.
              </p>
            </div>

            <input
              className="w-full text-sm bg-white/10 border border-white/30 text-white placeholder-white/70 py-2 px-4 rounded-full focus:outline-none focus:border-emerald-500 transition"
              type="text"
              name="title"
              placeholder="Enter Blog Title"
              required
            />
            {/* <div className="w-full rounded-xl bg-white/10 border border-white/30 overflow-hidden">
              <textarea
                className="w-full resize-none box-border text-sm text-white placeholder-white/70 py-2 px-4 focus:outline-none focus:border-emerald-500 transition textarea-scrollbar overflow-y-auto rounded-xl"
                name="description"
                placeholder="Enter Description"
                required
                rows={3}
              ></textarea>
            </div> */}
            <BlogEditor value={description} onChange={setDescription} />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white/70 file:text-white/70 file:bg-transparent file:border-0 file:p-0 placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
            />
            {previewImage && (
              <Image
                src={previewImage}
                alt="Blog Image Preview"
                width={150}
                height={150}
                className="rounded-xl object-cover border border-white/30"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center px-4 py-2 font-semibold text-white bg-emerald-700/40 border border-emerald-500 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-emerald-400/10 hover:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer"
            >
              {loading ? <div className="formLoader"></div> : "Publish Blog"}
              {/* Underline on Hover */}
              <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-300 group-hover:w-3/4" />
            </button>
          </form>

          {/* right side image */}
          <div className="lg:block hidden w-full lg:w-1/2">
            <Image
              width={500}
              height={500}
              src="/images/formimg2.jpeg"
              alt="Blog Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
