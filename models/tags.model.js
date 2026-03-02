import { Schema, model } from "mongoose";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    usageCount: {
      type: Number,
      default: 0
    },

    usageByType: {
      source: { type: Number, default: 0 },
      snippet: { type: Number, default: 0 },
      airesponse: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

tagSchema.index({ slug: 1 }, { unique: true })
tagSchema.index({ usageCount: -1 })  //Top newest tags fast.

export const Tag = model("Tag", tagSchema);