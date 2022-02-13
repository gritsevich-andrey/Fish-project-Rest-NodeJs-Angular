FROM node:latest as build
RUN echo "*** Build Phase ***"
WORKDIR .
ENV PATH ./node_modules/.bin:$PATH
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:latest
RUN echo "*** Deployment Phase ***"
COPY --from=build ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
