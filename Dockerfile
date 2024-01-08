FROM node:lts-alpine AS BUILDER
LABEL Description="Contains the Maintainerr Docker image"

WORKDIR /opt

ARG TARGETPLATFORM
ENV TARGETPLATFORM=${TARGETPLATFORM:-linux/amd64}

COPY server/ /opt/server/
COPY ui/ /opt/ui/
COPY docs/ /opt/docs/
COPY package.json /opt/package.json
COPY yarn.lock /opt/yarn.lock 
COPY datasource-config.ts /opt/datasource-config.ts
COPY ormconfig.json /opt/ormconfig.json
COPY jsdoc.json /opt/jsdoc.json
COPY start.sh /opt/start.sh

WORKDIR /opt/

RUN apk --update --no-cache add python3 make g++

RUN chmod +x /opt/start.sh

RUN yarn global add @nestjs/cli --network-timeout 99999999  && \
    yarn config set python /usr/bin/python3 && \
    yarn --force --non-interactive --frozen-lockfile --network-timeout 99999999

RUN yarn run build:server

RUN yarn run build:ui

RUN yarn run docs-generate && \
    rm -rf ./docs

RUN \
    case "${TARGETPLATFORM}" in ('linux/arm64' | 'linux/amd64') \
    yarn add --save --network-timeout 99999999 sharp  \
    ;; \
    esac

RUN yarn --production --non-interactive --ignore-scripts --prefer-offline --frozen-lockfile --network-timeout 99999999

FROM node:lts-alpine

ARG TARGETPLATFORM
ENV TARGETPLATFORM=${TARGETPLATFORM:-linux/amd64}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG DEBUG=false
ENV DEBUG=${DEBUG}

EXPOSE 80

WORKDIR /opt

COPY --from=BUILDER /opt ./
COPY supervisord.conf /etc/supervisord.conf

RUN apk add supervisor && \
    rm -rf /tmp/* && \
    mkdir /opt/data

VOLUME [ "/opt/data" ]

ENTRYPOINT ["/opt/start.sh"]