Full Stack Assigment

1.  Why did you choose this schema ?
->  As I read through the working part of gister I get to know that its uses multiple Entities which 
    can have multiple Tags. Hence to form a releation between this Tags and Entities I create seperate
    schema called "tagRelations" which showcase M:M relationship between "Tags" Collection and "Entities"
    collection.

2.  How do tag searches work internally ?
->  When we get Tag name we can find it by using tagId in Tags collection. Interneally mongodb by default
    apply indexing to its _id which means B-Tree is already cretaed on _id of Tags collection. So searching
    of tag becomes pretty fast.
    If we need to search entity who connect with those tags we can use tagRelation collection where by creating
    aggreation pipeline we can group document on basis of tagId and entityType.

3.  How would you extend search to surface semantically related Tags ?
->  For sementically releated Tags I applied namespace to tags. so when there is an entry of tag in collection
    there must be an namespace provided in req body.
    Now when we need to get semantic result I first get particular tagId and namespace attach to it from tag collection next I collect all tagIds releated with that namepsaces from same Tag collection. with the help of this tagId, I can get entityId from tagRelation schema then we can search for that particular document in Entity collection by using that entityId

    Trade-Off   - Gives search result very basic 
    Improvment  - We can apply Vector Based Embeddings where we can store the embeddings into the vector database
                  which helps to improve sementatic search

4.  Where does this system break first under scale ?
->  Its great oppurnity learn if its break at scale like 1M+ tags and entities. Although I am not aware about when
    this system break if its scale at that level. May be it can be conatiners or database crashing due to poor 
    queries, concurrent transcations, connection pooling ........... reason can be anything.


5.  What would you improve more with time ?
->  I would like to introduce mobile application for the same. Which can become handy for students and working 
    professional.
    features I like to built is img support where end users can click pic of any doc and can easily upload to 
    application.




PERFORMANCE AND INDEXING

1.  Read vs. write trade-offs of your index strategy
->  