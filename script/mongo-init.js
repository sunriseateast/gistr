// Connect to the admin database
db = db.getSiblingDB('admin');

// Create user for chatbotdb
db.createUser({
  user: "gister",
  pwd: "notebook",
  roles: [
    { role: "readWrite", db: "gisterdb" },
    { role: "dbAdmin", db: "gisterdb" }
  ]
});

// Switch to chatbotdb and create a test collection
db = db.getSiblingDB('gisterdb');
db.createCollection("init_check");

print("✅ chatbotdb and user 'roshan' initialized successfully");
