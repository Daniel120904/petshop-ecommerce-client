# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build


# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]