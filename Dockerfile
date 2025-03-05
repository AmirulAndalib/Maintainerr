FROM node:20-alpine3.19 AS base
LABEL Description="Contains the Maintainerr Docker image"

FROM base AS builder

WORKDIR /app

RUN yarn global add turbo@^2
COPY . .

RUN yarn install --network-timeout 99999999
RUN yarn cache clean

RUN <<EOF cat >> ./ui/.env
NEXT_PUBLIC_BASE_PATH=/__PATH_PREFIX__
EOF

RUN sed -i "s,basePath: '',basePath: '/__PATH_PREFIX__',g" ./ui/next.config.js

RUN yarn turbo build

FROM base AS runner

WORKDIR /opt/app

# copy standalone UI
COPY --from=builder --chmod=777 --chown=node:node /app/ui/.next/standalone/ui ./ui
COPY --from=builder --chmod=777 --chown=node:node /app/ui/.next/static ./ui/.next/static
COPY --from=builder --chmod=777 --chown=node:node /app/ui/public ./ui/public

# Copy standalone server
COPY --from=builder --chmod=777 --chown=node:node /app/server/dist ./server/dist
COPY --from=builder --chmod=777 --chown=node:node /app/server/package.json ./server/package.json
COPY --from=builder --chmod=777 --chown=node:node /app/server/node_modules ./server/node_modules

# Copy packages/contracts
COPY --from=builder --chmod=777 --chown=node:node /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder --chmod=777 --chown=node:node /app/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=builder --chmod=777 --chown=node:node /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY distribution/docker/supervisord.conf /etc/supervisord.conf
COPY --chmod=777 --chown=node:node distribution/docker/start.sh /opt/app/start.sh

ARG GIT_SHA

RUN mv /opt/app/ui/.env.docker /opt/app/ui/.env.production
RUN mv /opt/app/server/.env.docker /opt/app/server/.env.production
RUN sed -i "s/%GIT_SHA%/$GIT_SHA/g" _output/server/.env.production

# Create required directories
RUN mkdir -m 777 /opt/data && \
    mkdir -m 777 /opt/data/logs && \
    chown -R node:node /opt/data

# This is required for docker user directive to work
RUN chmod 777 /opt/app/start.sh && \
    chmod 777 /opt/app/ui && \
    chmod 777 /opt/app/ui/public && \
    chmod 777 /opt/app/ui/.next/static && \
    mkdir -m 777 /opt/app/ui/.next/cache && \
    chown -R node:node /opt/app/ui/.next/cache

RUN apk --update --no-cache add curl supervisor

ENV NODE_ENV=production
ENV UI_PORT=6246
ENV UI_HOSTNAME=0.0.0.0

# Temporary workaround for https://github.com/libuv/libuv/pull/4141
ENV UV_USE_IO_URING=0

USER node

EXPOSE 6246

VOLUME [ "/opt/data" ]
ENTRYPOINT ["/opt/app/start.sh"]
