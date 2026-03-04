// tagRelations.seed.js

export const tagRelations = [
  // SOURCE 1 tags
  {
    tagId: "64f000000000000000000003", // db/mongodb
    entityId: "64f100000000000000000001",
    entityType: "source",
    attachedBy: "system"
  },
  {
    tagId: "64f000000000000000000005", // backend/nodejs
    entityId: "64f100000000000000000001",
    entityType: "source",
    attachedBy: "system"
  },
  {
    tagId: "64f000000000000000000006", // concept/indexing
    entityId: "64f100000000000000000001",
    entityType: "source",
    attachedBy: "system"
  },

  // SOURCE 2 tags
  {
    tagId: "64f000000000000000000004", // db/redis
    entityId: "64f100000000000000000002",
    entityType: "source",
    attachedBy: "system"
  },
  {
    tagId: "64f000000000000000000007", // concept/caching
    entityId: "64f100000000000000000002",
    entityType: "source",
    attachedBy: "system"
  },

  // SNIPPET 1 tags
  {
    tagId: "64f000000000000000000003", // db/mongodb
    entityId: "64f100000000000000000003",
    entityType: "snippet",
    attachedBy: "user"
  },
  {
    tagId: "64f000000000000000000006", // concept/indexing
    entityId: "64f100000000000000000003",
    entityType: "snippet",
    attachedBy: "user"
  },

  // SNIPPET 2 tags
  {
    tagId: "64f000000000000000000003", // db/mongodb
    entityId: "64f100000000000000000004",
    entityType: "snippet",
    attachedBy: "user"
  },
  {
    tagId: "64f000000000000000000006", // concept/indexing
    entityId: "64f100000000000000000004",
    entityType: "snippet",
    attachedBy: "user"
  },

  // AI RESPONSE tags
  {
    tagId: "64f000000000000000000004", // db/redis
    entityId: "64f100000000000000000005",
    entityType: "airesponse",
    attachedBy: "system"
  },
  {
    tagId: "64f000000000000000000007", // concept/caching
    entityId: "64f100000000000000000005",
    entityType: "airesponse",
    attachedBy: "system"
  }
];