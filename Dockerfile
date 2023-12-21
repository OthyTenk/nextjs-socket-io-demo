
FROM node:20-alpine

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install node modules
COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm
RUN pnpm i

# Copy application code
COPY . .

RUN pnpm run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

CMD [ "pnpm", "start" ]