# ==============================================
# Stage 1: Development (for hot reload)
# ==============================================
FROM node:25-alpine AS development

WORKDIR /app

COPY ./package*.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]


# ==============================================
# Stage 2: Production (optimized, minimal)
# ==============================================
FROM node:25-alpine AS production

WORKDIR /app

COPY ./package*.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

RUN yarn build

CMD ["sh", "-c", "cp -r dist/* /usr/share/nginx/html"]
