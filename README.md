
# demo-rest-api

Demonstrate my knowledge on building REST API using Node JS standard library without having to rely on any framework.

## Table of contents

* [Intro](#intro)
* [Manual setup](#manual-setup)
* [Run server](#run-server)
* [Run using Docker](#run-using-docker)
* [Run test files](#run-test-files)
* [License](#license)

## Intro

This project is built entirely using pure Node JS except for test files which relies on Jest framework.

I had limit what will be included in this demo due to time constraint. But you can expect a few things as listed below but not limited to just those mentioned.

* Implementation of HTTP request router.
  * Supports GET, POST, PUT, PATCH, and DELETE.
  * Supports `multipart/form-data`, `application/json`, and `application/x-www-form-urlencoded`.
  * Supports static file processing.
- Unit testing using Jest framework.

## Manual setup

Navigate to root folder
```
cd demo-rest-api
```

Create cert directory
```
mkdir cert && cd cert
```

Generate a self-signed certificate for testing
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

Install dev dependencies
```
npm install
```

Run server
```
npm start
```

## Run using Docker
```
docker run --name demo-rest-api -d -p 3000:3000 leetbox/demo-rest-api:1.0
```

Server will start at default port 3000. Port can be changed through environment variable PORT.

## Run test files

Test once
```
npm test
```

Automatically re-run test when there is changes
```
npm run watch-start
```
## License

See [LICENSE](https://github.com/ridhuanhassan/demo-rest-api/blob/main/LICENSE) for the full
license text.