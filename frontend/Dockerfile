FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y python3 make g++ && \
    npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --build-from-source --force && \
    npm rebuild

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]