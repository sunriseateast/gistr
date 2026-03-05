#!/bin/sh

echo "🌱 Running database seed..."
node dist/feedseed.js

echo "🚀 Starting server..."
node dist/index.js