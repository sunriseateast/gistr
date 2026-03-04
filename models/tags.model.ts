import { Schema, model } from "mongoose";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    namespace: {
      type: String,
      required: true,
      index: true,
    },

    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);


tagSchema.index({ usageCount: -1 }); //Top newest tags fast.

export const Tag = model("Tag", tagSchema);
