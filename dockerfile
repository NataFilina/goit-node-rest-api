FROM node:20-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /
COPY . .
RUN yarn install --production
CMD ["node", "./app.js"]