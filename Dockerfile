# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.17
RUN npm install -g yarn@$YARN_VERSION --force

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY --link . .

# Build application
RUN yarn run build

# Remove development dependencies
RUN yarn install --production=true

# Remove unnecessary files
RUN rm -rf node_modules && yarn install --production=true && rm -rf /root/.cache

# Final image
FROM node:${NODE_VERSION}-slim as final

WORKDIR /app

COPY --from=base /app /app

EXPOSE 8080
CMD [ "yarn", "run", "start" ]
