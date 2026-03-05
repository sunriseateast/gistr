import type { Request, Response } from "express";
import asyncHandler from "../asyncHandler.js";
import createError from "http-errors";
import { Tag } from "../models/tags.model.js";
import { TagRelation } from "../models/tagRelations.model.js";

interface AnalyticsQuery {
  days?: string
}

interface EntityType {
  entityType?: string
}


//Total usage count per tag
export const getTagsUsage = asyncHandler(
  async(req: Request, res: Response)=>{
    try{
        const tags = await Tag.find({})
        .select("name slug namespace usageCount")
        .sort({ usageCount: -1 });

        return res.status(200).json({
          success: true,
          data: {
            tags
          },
        });
    }
    catch(error){
      throw createError(500, `Someting went wrong in getUsage:${error}`);
    }
  }
)



//Usage count broken down by entity type
export const tagUsagebyEntity = asyncHandler(
  async(req:Request<{}, {}, {}, EntityType>,res:Response)=>{
    try{
      const { entityType }=req.query

      if( !entityType ){
        throw createError(400,"Entity type required")
      }

      let tagsUsagebyEntity: any[] = [];
      //usage count broken down by entity type
      tagsUsagebyEntity = await TagRelation.aggregate([
        {
          $match: {
            entityType: entityType,
          }
        },
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
          tagsUsagebyEntity,
        },
      });

    }
    catch(error){
      throw createError(500, `Someting went wrong in tagUsagebyEntity:${error}`);
    }
  }
)



//Top tags in the last `N` days
export const tagUsageDays = asyncHandler(
  async (req: Request<{}, {}, {}, AnalyticsQuery>, res: Response) => {
    try {
      const { days } = req.query;

      if(!days){
        throw createError(400,"Provide Nummber of Days")
      }

      let topTagsLastNDays: any[] = [];
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

      return res.status(200).json({
        success: true,
        data: {
          topTagsLastNDays
        },
      });
    }
    catch (error) {
      throw createError(500, `Someting went wrong in tagUsageDays:${error}`);
    }
  },
);
