FROM node:16-alpine
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm i
EXPOSE 3000:3000

CMD ["npm", "run", "start"]