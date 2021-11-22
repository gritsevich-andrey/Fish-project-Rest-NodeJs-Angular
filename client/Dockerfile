FROM node:14
WORKDIR /usr/src/fish/
COPY package*.json ./
RUN npm install
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
# копируем исходный код
COPY . .
EXPOSE 5000 3001
CMD [ "node", "index.js" ]

