import type { Request, Response } from "express";
import asyncHandler from "../asyncHandler.js";
import createError from "http-errors";
import { Tag } from "../models/tags.model.js";
import { TagRelation } from "../models/tagRelations.model.js";
import mongoose from "mongoose";

interface AttachTagsBody {
  entityId?: string;
  tags?: string[];
  entityType?: string;
  attachedBy?: string;
  includNamespace?: string;
}

export const attachTags = asyncHandler(
  async (req: Request<{}, {}, AttachTagsBody>, res: Response) => {
    try {
      const { entityId, tags, entityType, attachedBy, includNamespace } =
        req.body;

      if (
        !entityId ||
        !Array.isArray(tags) ||
        !entityType ||
        !attachedBy ||
        !includNamespace
      ) {
        throw createError(400, "Invalid Payload");
      }

      //normalize Tags and set ensuers no duplicate tags in array
      const normalizedTags = [
        ...new Set(
          tags
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0),
        ),
      ];

      //session is use for creating single transcation
      //instead of multiple transcation so either it
      //success or failed at once to overcome from
      //tiny window probllem of (if system crashes)
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const attachedTags = [];

        for (const tagName of normalizedTags) {
          const slug = tagName.replace(/\s+/g, "-");

          //this is will ensure no duplicate document in Tag collection
          const tag = await Tag.findOneAndUpdate(
            { slug },
            { $setOnInsert: { name: tagName, slug, includNamespace } },
            { upsert: true, new: true, session },
          );

          //create relation in Tag relation collection
          const relation = await TagRelation.updateOne(
            { tagId: tag._id, entityId },
            {
              $setOnInsert: {
                tagId: tag._id,
                entityId,
                entityType,
                attachedBy,
              },
            },
            { upsert: true, session },
          );

          //if there are unique relation then only we
          //increment the counter
          if (relation.upsertedCount > 0) {
            await Tag.updateOne(
              { _id: tag._id },
              { $inc: { usageCount: 1 } },
              { session },
            );
          }

          attachedTags.push(tag);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
          success: true,
          tags: attachedTags,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } 
    catch (error) {
      throw createError(500, `Someting went wrong:${error}`);
    }
  },
);
