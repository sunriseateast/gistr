import { Schema, model } from "mongoose";

const entitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["source", "snippet", "airesponse"],
      required: true,
      index: true,
    },

    title: String,
    url: String,
    content: String,

    sourceId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
    },

    metadata: {
      type: Schema.Types.Mixed,
    },

    deletedAt: Date,
  },
  { timestamps: true },
);

entitySchema.index({ type: 1, createdAt: -1 });
entitySchema.index({ sourceId: 1 });

export const Entity = model("Entity", entitySchema);
