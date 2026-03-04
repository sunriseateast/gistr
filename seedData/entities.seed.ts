// entities.seed.js

export const entities = [
  // SOURCE 1
  {
    _id: "64f100000000000000000001",
    type: "source",
    metadata: {
      title: "Scaling MongoDB Indexes",
      url: "https://example.com/mongo-indexing",
      author: "John Doe"
    }
  },

  // SOURCE 2
  {
    _id: "64f100000000000000000002",
    type: "source",
    metadata: {
      title: "Redis for High Performance Systems",
      url: "https://example.com/redis-performance",
      author: "Jane Smith"
    }
  },

  // SNIPPET 1 (belongs to source 1)
  {
    _id: "64f100000000000000000003",
    type: "snippet",
    sourceId: "64f100000000000000000001",
    metadata: {
      content: "Compound indexes improve AND query performance."
    }
  },

  // SNIPPET 2 (belongs to source 1)
  {
    _id: "64f100000000000000000004",
    type: "snippet",
    sourceId: "64f100000000000000000001",
    metadata: {
      content: "High cardinality fields increase index size."
    }
  },

  // AI RESPONSE
  {
    _id: "64f100000000000000000005",
    type: "airesponse",
    metadata: {
      prompt: "How does Redis set intersection work?",
      response: "Redis performs set intersection in memory using optimized hashing."
    }
  }
];