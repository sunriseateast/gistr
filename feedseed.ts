import mongoose from "mongoose";
import { Entity } from "./models/entities.model.js";
import { Tag } from "./models/tags.model.js";
import { TagRelation } from "./models/tagRelations.model.js";

// Import seed data
import { entities } from "./seedData/entities.seed.js";
import { tagRelations } from "./seedData/tagRelations.seed.js";
import { tags } from "./seedData/tag.seed.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://gister:notebook@mongodb:27017/gisterdb?authSource=admin";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clear previous data
    await Entity.deleteMany({});
    await Tag.deleteMany({});
    await TagRelation.deleteMany({});

    await Entity.insertMany(entities);
    await Tag.insertMany(tags);
    await TagRelation.insertMany(tagRelations);

    console.log("🎉 Seed data inserted successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedDatabase();