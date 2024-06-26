FROM node:20-alpine As build
WORKDIR /usr/src/app
COPY . ./
RUN yarn install && \
    yarn db:generate && \
    yarn build
 
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY yarn.lock package.json ./
RUN yarn install --production && yarn cache clean --force
 
FROM node:20-alpine As production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist/src ./src
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/yarn.lock .
COPY --chown=node:node --from=deps /usr/src/app/node_modules/ ./node_modules/
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma/
COPY --chown=node:node --from=build /usr/src/app/tsconfig.json .
 
ENV NODE_ENV production
EXPOSE 3000
 
# Start the server using the production build
CMD [ "node", "src/server.js"]