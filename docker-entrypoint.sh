#!/bin/sh

echo "🌱 Waiting for MongoDB to be ready..."
./wait-for-it.sh mongodb:27017 --timeout=30 --strict

echo "🌱 Running database seed..."
node dist/feedseed.js

echo "🚀 Starting server..."
node dist/index.js