FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build TS (ES Modules)
RUN npm run build

# Entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/docker-entrypoint.sh"]