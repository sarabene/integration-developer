#Base image
FROM node:16-alpine

WORKDIR /src/app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
