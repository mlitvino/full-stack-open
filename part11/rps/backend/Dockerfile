# ==============================================
# Stage 1: Development (for hot reload)
# ==============================================
FROM node:25-alpine AS development

WORKDIR /app

COPY ./package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]


# ==============================================
# Stage 2: Production (optimized, minimal)
# ==============================================
FROM node:25-alpine AS production

WORKDIR /app

COPY ./package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
