import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      },
    },
  },
);

postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ dateCreated: 1 });

export const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
