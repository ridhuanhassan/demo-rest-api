
# demo-rest-api

Demonstrate my knowledge on building REST API using Node JS standard library without having to rely on any framework.

## Intro

This project is built entirely using pure Node JS except for test files which relies on Jest framework.

## Setup

Navigate to root folder
> cd demo-rest-api

Create cert directory
> mkdir cert && cd cert

Generate a self-signed certificate for testing
> openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

Install dev dependencies
> npm install

## Run server

> npm start

Server will start at default port 3000. Port can be changed through environment variable PORT.

## Run test

Test once
> npm test

Automatically re-run test when there is changes
> npm run watch-start
