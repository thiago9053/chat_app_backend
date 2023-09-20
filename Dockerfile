FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 1211

# Development
CMD ["npm", "run", "dev"]