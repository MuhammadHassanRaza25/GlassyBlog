const { default: mongoose } = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogModel = mongoose.models.Blogs || mongoose.model("Blogs", BlogSchema);

export default BlogModel;
