FROM node:14.18.1
WORKDIR /usr/src/fish/client/
COPY package*.json ./
RUN npm install
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
# копируем исходный код
COPY . .
#RUN npm run build
EXPOSE 4200 49153
CMD npm run start

## STAGE 2: Run ###
#FROM nginx:alpine
## Заменяем дефолтную страницу nginx соответствующей веб-приложению
#RUN rm -rf /usr/share/nginx/html/*
#COPY --from=node /usr/src/fish/client/dist/ /usr/share/nginx/html
#COPY ./ngix.conf /etc/nginx/nginx.conf
#ENTRYPOINT ["nginx", "-g"]
