# 🚀 Full Stack Assignment

---

# ⚡ PERFORMANCE AND INDEXING

---

## 1️⃣ Read vs. write trade-offs of your index strategy

> When we apply indexing system priorotize fast read performance for frequently queried  
> fileds such as in given collection,

---

### 🗂 1.Entities:

```
Index apply to "createdAt" and "_id" where we need to search entities in
asscending order for pagination.
```

---

### 🏷 2.Tags:

```
Index apply to "_id", "slug", "namespace", "usageCount" because when users
sends Tag name we can search on basis of "slug" which is unique and Indexed
results in faster read which further helps to get "_id" and "namespace" of
tag/slug which is also indexed."usageCount" is indexed due to get analytics
of each Tag in collection.
```

---

### 🔗 3.Tagrelation:

```
Index aplly to "tagId" and "entityId" to get faster reads.compound index apply
to group of "tagId" and "entityId" for unqiue document in that collection
```

```
This improves search and analytics queries but increases write cost because MongoDB
must update all relevant indexes during each insert and update operations.which can
result in more consumption of resources like "write disk operations".
```

---

### 🛠 Solution ->

```
We need to Index only required fileds to avoid more write cost.Like here only those
fileds are Indexed who's are responsilbe for search and analytics.
If database scale we can create secoundary databse where we points all read ops to
this secounday database and all write ops to the primary database.
```

---

## 2️⃣ What happends when you have 100k tags ? 1M entities?

```
When there are 100k tags and 1M+ entities the tag realtion collection become heavy.
which results in wherever we use aggreation pipeline like in searchEntites and in
getAnalytics cost gets increases due to $group.becasue system needs to scan all those
documents then depending upon query it $group them where internally $group stores its
temp doc in RAM but if this temp doc size increases it may spill out to disk
which results in
```

### 📈 Impact:

```
1.CPU usage increases
2.Memory usage increases
3.Disk I/O increases
4.Response time increases
```

---

## 3️⃣ How your query scale as data grows ?

```
For increasing number of data 100K+ tags nad 1M+ entities we can introduce caching
technique like "Redis" caching system.
Like here we need to serach Entites with given Tag we can create Key Value pair at
same time when we creating relation in relation collection.Key value pair can be
```

```
Key:Mongo(tagname/tagId)
Value:{E1, E2, E3}(entityId)
```

```
Now whenever we need to get Entity with that specified Tag by user we do not need to
scan whole collection with aggreation we can simply get the value from Redis store.
Similarly we can create Key Value pairs for the analytics query in Redis.
```

---

# 🛡 PREVENT TAG EXPLOSION

---

## 1️⃣ Why you chose this approach, what it handles well, and where it falls short.

```
To prevent uncontrolled tag variations systems implements namespaces tags
such as for Tag javascript, java-script, JavaScript namespace can be database
```

### ✅ Benifites:

```
1.Improves analytics like semantic search
2.Enable namespace level search
```

### ⚠ Limitations:

```
1.Auto detect not there like JS->Javascript
2.Multiple tags with same meaning can be created.results in multiple documents.
```

---

# 🧠 SEMANTIC SEARCH

---

## 1️⃣ How would you extend this system so that searching for one tag surfaces releated content ?

```
For semantic search system implements namespace for Tags.
```

### 🔄 Working:

```
1.Users send tag name search carries out in collection.
2.Related namespace get selected.
3.Carried out next search for all tagIds who's having same namespace in Tag collection.
4.Search for all entityIds in tagRelation collection with help of given tagIds.
5.Find all entities from Entity collection with that entityId.
```

### ⚖ Trade off:

```
1.Users must understand and select the correct namespace which can result to user friction.
2.Renaming or restructing namespace requires bulk updates.
```

---

### 🚀 For better results Vector Embedding:

```
If collection gets uncontrolled tags or larger datasets we can implement vectors
embedding.
```

### 🔄 Working:

```
1.Generate embeddings of provided tags with any model like OpenAi
2.Store it into vector database
3.When users query for entity with that releated tag we compare embeddings of this tag
with stored embeddings by using cosine similarity math
```

### ⚖ Trade off:

```
1.Extra cost need OpenAi API
2.Seperate vector databse to store this embedding
3.Increases complexity
```

---

# ❓ MORE QUESTIONS:

---

## 1️⃣ Why did you choose this schema ?

```
The system uses a many-to-many schema model tagging relationship.like here an Entity
can have multiple Tags or Tag can attach to single Entity
```

```
Entity <-> TagRelation <-> Tags
```

```
1.There are centralized tag collection schema which stores the tags
2.tagRealtion schema enforcess uniqueness amoung each tag and entity using compound index
3.Entity schema are flexiable we can add more types of entity.
4.Schema is optimized for search and analytics query.
```

---

## 2️⃣ How do tag searches work internally ?

```
In given system each Tag is associated with entityId's.where we can search entity by
using OR queries, while AND queries compute interactions.This searches for AND query
is done by using aggreation pipeline + grouping
```

---

## 3️⃣ How would you extend search to surface semantically related Tags ?

```
SEMANTIC SEARCH
```

---

## 4️⃣ Where does this system break first under scale ?

```
The system will face bottlneck first under searchEntites and getAnalytics query
level.because as collection grows to 100K+ Tags and 1M+ Entities, query for searching
Entity either OR, AND will scan whole collection which results in slower reads
and writes to database leading to increased CPU, memory usage.
```

---

## 5️⃣ What would you improve more with time ?

```
1.Implement Redis as caching layer for frequently use queries or query that need
to scan whole collection with aggreation.It help to reduce RAM, CPU usage also
help to manage the read load of database.
2.Introducing secounday/slave database for read worloads only.which help to make
some room for write queries.
3.For semantic search vector embedding.
4.Observability and Monitoring like Disk I/O, Network I/O, RAM usage of database server
by using prometheus and grafana
5.Centralize Logging by using Pino on dashboard side Loki and Grafan
```

### ✨ Features:

```
1.Image upload option
2.Mobile application of gister
```

---

# 🌱 SEED DATA:

---

## 1️⃣ The promt you used or a short description of your approach

```
For promt I used chatGPt copy paste all 3 schemas and promt for "give me seed data for
all 3 schema where in tagRealtion tags should be overlap to enitity"
```

---