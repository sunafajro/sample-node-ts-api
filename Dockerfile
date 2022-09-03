FROM node:18

RUN mkdir /app
WORKDIR /app

COPY src ./src
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./tsconfig.json

RUN npm ic

EXPOSE 7007

CMD [ "npm", "run", "start" ]