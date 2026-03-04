import { Schema, model } from "mongoose";

const entitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["source", "snippet", "airesponse"],
      required: true,
      index: true,
    },

    sourceId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
    },

    metadata: {
      type: Schema.Types.Mixed,
    }
    
  },
  { timestamps: true },
);

entitySchema.index({ createdAt: -1 });

export const Entity = model("Entity", entitySchema);
