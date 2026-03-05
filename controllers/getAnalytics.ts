import type { Request, Response } from "express";
import asyncHandler from "../asyncHandler.js";
import * as createError from "http-errors";
import { Tag } from "../models/tags.model.js";
import { TagRelation } from "../models/tagRelations.model.js";

interface AnalyticsQuery {
  days?: string;
}

export const getTagAnalytics = asyncHandler(
  async (req: Request<{}, {}, {}, AnalyticsQuery>, res: Response) => {
    try {
      const { days } = req.query;

      //find total usage per tag
      const tags = await Tag.find({})
        .select("name slug namespace usageCount")
        .sort({ usageCount: -1 });

      //top tags in ndays by using tagreleation where
      //releation gets created
      let topTagsLastNDays: any[] = [];
      let tagsUsagebyEntity: any[] = [];

      if (days) {
        const daysNumber = parseInt(days);
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - daysNumber);

        topTagsLastNDays = await TagRelation.aggregate([
          //filder by date
          {
            $match: {
              createdAt: { $gte: thresholdDate },
            },
          },

          //group by TagId
          {
            $group: {
              _id: "$tagId",
              usage: { $sum: 1 },
            },
          },

          // sort descending
          {
            $sort: { usage: -1 },
          },

          // join with Tag collection
          {
            $lookup: {
              from: "tags", // the other collection
              localField: "_id", // tagId from TagRelation group
              foreignField: "_id", // matching _id in Tag collection
              as: "tag",
            },
          },

          //flattern the array
          {
            $unwind: "$tag",
          },

          //shape output
          {
            $project: {
              _id: 0,
              tagId: "$_id",
              name: "$tag.name",
              slug: "$tag.slug",
              namespace: "$tag.namespace",
              usage: 1,
            },
          },
        ]);
      }

      //usage count broken down by entity type
      tagsUsagebyEntity = await TagRelation.aggregate([
        {
          $group: {
            _id: {
              tagId: "$tagId",
              entityType: "$entityType",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: {
          tags,
          topTagsLastNDays,
          tagsUsagebyEntity,
        },
      });
    }
    catch (error) {
      throw createError(500, `Someting went wrong:${error}`);
    }
  },
);
