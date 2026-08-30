FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
COPY backend ./backend
COPY frontend/package.json ./frontend/package.json
COPY packages ./packages
RUN npm ci

ARG SERVICE_PATH
RUN npm run build --workspace=$SERVICE_PATH

CMD ["sh", "-c", "npm run start --workspace=$SERVICE_PATH"]

