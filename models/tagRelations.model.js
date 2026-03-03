import { Schema, model } from "mongoose";

const tagRelationSchema = new Schema(
  {
    tagId: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
      index: true,
    },

    entityId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ["source", "snippet", "airesponse"],
      required: true,
    },

    attachedBy: {
      type: String,
      enum: ["system", "user"],
      required: true,
    },
  },
  { timestamps: true },
);

// compound unique index
// this ensure same tag cannot be applied at DB level
tagRelationSchema.index({ tagId: 1, entityId: 1 }, { unique: true });

export const TagRelation = model("TagRelation", tagRelationSchema);
