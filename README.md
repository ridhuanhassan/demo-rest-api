# demo-rest-api
Demonstrate my knowledge on building REST API using Node JS without having to rely on any framework.

## Setup
Navigate to root folder
> cd demo-rest-api

Create cert directory
> mkdir cert && cd cert

Generate a self-signed certificate for testing
> openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem


## Run server
> npm start

Server will start at default port 3000. Port can be changed through environment variable PORT.
