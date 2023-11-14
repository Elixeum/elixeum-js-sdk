FROM docker.io/library/node:21 AS build

WORKDIR /source

# Copy source code
COPY . .

# Remove any old build data
RUN rm -rf dist/

# Print tools versions
RUN node --version
RUN npm --version

# Install dependencies
RUN npm install

# Build
ARG NODE_ENV=production
RUN echo "Using NODE_ENV=${NODE_ENV}"
RUN npm run build
