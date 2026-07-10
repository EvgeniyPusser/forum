import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      default: ["USER"],
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.passwordHash;
      },
    },
  },
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
