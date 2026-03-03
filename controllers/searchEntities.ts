import { Request, Response } from "express";
import asyncHandler from "../asyncHandler";
import createError from "http-errors";
import { Tag } from "../models/tags.model";
import { TagRelation } from "../models/tagRelations.model";
import { Entity } from "../models/entities.model";

interface SearchQuery {
  tags?: string;
  mode?: "and" | "or";
  page?: string;
  limit?: string;
  includNamespace?: string;
}

//To search entities
//Core logic
//Step:1 -> Find TagIds of  provided tags
//Step:2 -> Find EntitiyIds from TagIds from tagReleation collection
//Step:3 -> Show on basis of OR,AND operator from Entity collection
//Step:4 -> Show data on basis of provided page and limit
export const searchEntities = asyncHandler(
  async (req: Request<{}, {}, {}, SearchQuery>, res: Response) => {
    try {
      const { tags, mode, page, limit, includNamespace } = req.query;

      if (!tags) {
        throw createError(400, "Tags are required");
      }

      //pagination number
      const pageNumber = Math.max(parseInt(page ?? "1"), 1);
      const limitNumber = Math.max(parseInt(limit ?? "20"), 1);
      const skip = (pageNumber - 1) * limitNumber;

      //Step1: Find TagIds of  provided tags
      const tagArray = tags
        .split(",") // "mongodb,database" → ["mongodb","database"]
        .map((tag) => tag.trim().toLowerCase()) // normalize
        .filter((tag) => tag.length > 0);

      if (tagArray.length === 0) {
        throw createError(400, "Invalid tags");
      }

      let foundTags;

      //Namspace only respect when mode is or
      if (includNamespace && mode === "or") {
        //first we get namespace of that tag
        const requestedTags = await Tag.find({
          slug: { $in: tagArray },
        }).select("_id namespace slug");

        if (requestedTags.length === 0) {
          return res.status(200).json({
            success: true,
            message: {
              total: 0,
              page: pageNumber,
              limit: limitNumber,
              data: [],
            },
          });
        }

        const namespaces = [
          ...new Set(requestedTags.map((tag) => tag.namespace)),
        ];

        //then we get all tags with that namespaces
        foundTags = await Tag.find({
          namespace: { $in: namespaces },
        }).select("_id slug");
      } else {
        foundTags = await Tag.find({
          slug: { $in: tagArray },
        }).select("_id slug");

        if (foundTags.length === 0) {
          return res.status(200).json({
            success: true,
            messgae: {
              total: 0,
              page: pageNumber,
              limit: limitNumber,
              data: [],
            },
          });
        }
      }

      //Step2 and Step3: Find EntitiyIds from TagIds from tagReleation collection
      const tagIds = foundTags.map((tag) => tag._id);
      let entityIds: string[] = [];

      if (mode === "or") {
        //find entityId (OR MODE)
        const relations = await TagRelation.find({
          tagId: { $in: tagIds },
        }).select("entityId");

        entityIds = [...new Set(relations.map((r) => r.entityId.toString()))];
      } else if (mode === "and") {
        const aggregation = await TagRelation.aggregate([
          {
            $match: {
              tagId: { $in: tagIds },
            },
          },
          {
            $group: {
              _id: "$entityId",
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: tagIds.length,
            },
          },
        ]);

        entityIds = aggregation.map((doc) => doc._id.toString());
      }

      if (entityIds.length === 0) {
        return res.status(200).json({
          success: true,
          messgae: {
            total: 0,
            page: pageNumber,
            limit: limitNumber,
            data: [],
          },
        });
      }

      //Step4: Show data on basis of provided page and limit
      const total = await Entity.countDocuments({
        _id: { $in: entityIds },
      });

      const entities = await Entity.find({
        _id: { $in: entityIds },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

      return res.status(200).json({
        success: true,
        messgae: {
          total,
          page: pageNumber,
          limit: limitNumber,
          data: entities,
        },
      });
    }
    catch (error) {
      throw createError(500, `Someting went wrong:${error}`);
    }
  },
);
