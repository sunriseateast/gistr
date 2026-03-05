# 🚀 Full Stack Assignment

------------------------------------------------------------------------

# ⚡ PERFORMANCE AND INDEXING STRATEGY

------------------------------------------------------------------------

## 1️⃣ Read vs Write Trade-offs of the Index Strategy

In this system, indexing is designed to optimize read-heavy workloads
(search + analytics), while consciously accepting higher write costs due
to index maintenance.

MongoDB must update every relevant index during insert/update
operations, which introduces:

-   Write amplification
-   Increased disk I/O
-   Higher memory pressure (index pages must fit in RAM)
-   Larger storage footprint

Therefore, indexes are applied only to fields that directly impact
search, filtering, sorting, and analytics queries.

------------------------------------------------------------------------

### 🗂 1. Entities Collection

**Indexes:** - `_id` - `createdAt` (ascending)

**Why?** - Pagination requires sorting by `createdAt` - `_id` ensures
fast lookups and stable ordering - Supports efficient range queries

**Trade-off:** - Minimal write overhead

------------------------------------------------------------------------

### 🏷 2. Tags Collection

**Indexes:** - `_id` - `slug` (unique) - `namespace` - `usageCount`

**Why?** - `slug` is unique and acts as the primary lookup key. -
`namespace` enables semantic grouping. - `usageCount` supports analytics
queries (top tags, trending tags).
filtering by namespace + sorting by usageCount.

**Trade-offs:** - Each insert/update modifies multiple indexes. - High
cardinality fields increase index size. - If index size exceeds RAM,
performance degrades due to disk reads.

------------------------------------------------------------------------

### 🔗 3. TagRelation Collection

This is the most critical collection under scale.

**Indexes:** - `tagId` - `entityId` - Compound unique index (`tagId`,
`entityId`)

**Why?** - Ensures no duplicate tag-entity relationship. - Enables
efficient filtering by tag. - Supports AND query intersection logic.

**Trade-offs:** - High write amplification. - Index size grows rapidly
with N:M growth. - Becomes the first bottleneck at scale.

------------------------------------------------------------------------

## 🛠 Production Optimization Strategy

To balance read/write performance:

1.  Index only query-critical fields.
2.  Avoid indexing low-selectivity fields.
3.  Use read replicas:
    -   Primary → Writes
    -   Secondary → Reads
4.  Monitor index size vs available RAM.


------------------------------------------------------------------------

# 📊 SCALING SCENARIOS

------------------------------------------------------------------------

## 2️⃣ What Happens at 100K Tags and 1M+ Entities?

At this scale:

-   TagRelation grows explosively (N:M expansion).
-   Aggregation pipelines become expensive.
-   `$group` stages consume significant RAM.
-   MongoDB may spill to disk if memory exceeds limits.

### 🔥 Primary Bottlenecks

1.  Aggregation-heavy queries (`searchEntities`, `getAnalytics`)
2.  AND queries requiring grouping/intersection
3.  Large index scans

### 📈 Impact

-   CPU spikes
-   Memory pressure
-   Disk spill
-   Increased latency
-   Slower writes due to index updates

------------------------------------------------------------------------

# 🚀 QUERY SCALABILITY STRATEGY

------------------------------------------------------------------------

## 3️⃣ Scaling Reads with Caching (Redis Layer)

To prevent repeated heavy aggregations:

Introduce a Redis caching layer.

### Strategy:

Key: tag:{tagId}\
Value: \[entityId1, entityId2, entityId3\]

Now:

-   No full collection scan required
-   No aggregation pipeline needed
-   O(1) lookup from Redis
-   Significant reduction in DB CPU load

### Benefits:

-   Offloads read pressure
-   Reduces RAM usage in MongoDB
-   Improves response time

### Trade-off:

-   Cache invalidation complexity
-   Memory cost in Redis
-   Eventual consistency risk

------------------------------------------------------------------------

# 🛡 PREVENTING TAG EXPLOSION

------------------------------------------------------------------------

## Namespace-Based Normalization

Example:

javascript\
java-script\
JavaScript

→ Namespace: `javascript`

### ✅ What This Solves

-   Better analytics
-   Cleaner semantic grouping
-   Reduced fragmentation
-   Easier aggregation

### ⚠ Limitations

-   No automatic synonym detection
-   Manual namespace governance required
-   Risk of inconsistent tagging if rules are not enforced

------------------------------------------------------------------------

# 🧠 SEMANTIC SEARCH EXTENSION

------------------------------------------------------------------------

## Namespace-Based Semantic Search

Flow:

1.  User searches a tag
2.  Fetch namespace
3.  Retrieve all tags under that namespace
4.  Fetch entityIds via TagRelation
5.  Return related entities

This enables lightweight semantic grouping without ML.

------------------------------------------------------------------------

## 🚀 Advanced Approach: Vector Embeddings

For large-scale systems with uncontrolled tagging:

### Architecture:

1.  Generate embeddings for tags (OpenAI or similar model)
2.  Store in a vector database
3.  Compare via cosine similarity

### Benefits:

-   True semantic similarity
-   Synonym detection
-   Fuzzy concept matching

### Trade-offs:

-   API cost
-   Additional infrastructure
-   Increased system complexity
-   Embedding maintenance overhead

------------------------------------------------------------------------

# ❓ ARCHITECTURAL QUESTIONS

------------------------------------------------------------------------

## Why Many-to-Many Schema?

Entity \<-\> TagRelation \<-\> Tag

This design:

-   Avoids embedding arrays that grow unbounded
-   No duplicates
-   Enables independent scaling
-   Supports analytics and search efficiently

------------------------------------------------------------------------

## How Do Tag Searches Work?

### OR Query

-   Direct filtering via indexed `tagId`

### AND Query

-   Aggregation pipeline
-   `$group` intersection logic
-   Potential performance bottleneck

------------------------------------------------------------------------

## Where Does the System Break First?

The first breaking point:

TagRelation collection under heavy aggregation.

Why?

-   Large index size
-   High cardinality
-   Expensive `$group`
-   Increased memory footprint

------------------------------------------------------------------------

# 📈 FUTURE IMPROVEMENTS

------------------------------------------------------------------------

1.  Introduce Redis for heavy read queries
2.  Use Read Replicas for scaling reads
3.  Implement Vector Search for semantic expansion
4.  Add Observability (Prometheus + Grafana)
5.  Centralized logging (Pino + Loki)

------------------------------------------------------------------------

# ✨ FEATURES

-   Image upload support
-   Scalable tagging system
-   Semantic search capability
-   Analytics-ready schema
-   Redis-based performance optimization

------------------------------------------------------------------------

# 🌱 SEED DATA APPROACH

Seed data was generated using structured schema definitions to ensure:

-   Overlapping tags across entities
-   Realistic many-to-many relationships
-   Namespace-based grouping
-   Balanced distribution for analytics testing

PROMT: Copy paste all 3 schemas "Give me seed data for all 3 schema's where in tagRelation tags should be overlap to entity".

------------------------------------------------------------------------
