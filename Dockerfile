FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for Medusa
RUN apk add --no-cache python3 make g++ postgresql-client

# Enable Corepack for modern Yarn versions
RUN corepack enable

# Copy package.json and lockfiles
COPY package.json .
COPY yarn.lock* .
COPY package-lock.json* .
COPY pnpm-lock.yaml* .
COPY .yarnrc.yml* .

# Inicializácia Yarn 4 (vytvoriť .yarn adresár)
RUN if [ -f yarn.lock ] && [ -f .yarnrc.yml ]; then \
      # Vytvorenie .yarn adresára a potrebných súborov
      mkdir -p .yarn/releases && \
      yarn set version 4.6.0 && \
      yarn install; \
    elif [ -f yarn.lock ]; then \
      # For Yarn 1.x
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack prepare pnpm@latest --activate && pnpm i; \
    else npm i; \
    fi

# Copy all files
COPY . .

# Build the app
RUN if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then pnpm build; \
    else npm run build; \
    fi

# Expose port
EXPOSE 9000

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Start the app with our entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["yarn", "start"]