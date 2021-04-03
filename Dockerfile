FROM node:14.16.0

WORKDIR '/demo-rest-api'

RUN mkdir cert

RUN openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 \
    -keyout cert/key.pem -out cert/cert.pem -subj '/CN=MY'

COPY package.json .

COPY package-lock.json .

RUN npm install --loglevel=error

COPY . .

CMD npm start

EXPOSE 3000/tcp
