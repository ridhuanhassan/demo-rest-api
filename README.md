
# demo-rest-api

Demonstrate how I build REST API using Node JS standard library without having to rely on any framework.

## Table of contents

* [Intro](#intro)
* [Manual setup](#manual-setup)
* [Pre-requisite](#pre-requisite)
* [Run server](#run-server)
* [Run using Docker](#run-using-docker)
* [Run test files](#run-test-files)
* [API endpoints](#api-endpoints)
* [License](#license)
* [Footnote](#footnote)

## Intro

This project is built entirely using pure Node JS. File `package.json` ([link](https://github.com/ridhuanhassan/demo-rest-api/blob/main/package.json#L29)) contains only dev dependencies for testing and linting.

I had to limit what will be included in this demo due to time constraint.
But you can expect a few things as listed below to be part of the codes.

* Implementation of HTTPS server. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/server.js)
  * Supports `multipart/form-data`, `application/json`, and `application/x-www-form-urlencoded`. [Jump to line.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/server.js#L117)
  * Supports static file processing. [Jump to line.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/server.js#L34)
* Implementation of HTTPS request router. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/router.js)
  * Supports GET, POST, PUT, PATCH, and DELETE. [Jump to line.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/router.js#L91)
* Demonstrate the usage of HTTPS request router.
  * Demo 1. [Jump to file](https://github.com/ridhuanhassan/demo-rest-api/blob/main/routers/demo1.js)
  * Demo 2. [Jump to file](https://github.com/ridhuanhassan/demo-rest-api/blob/main/routers/demo2.js), <em>Please note that this file contains only routers. Please see controller below to see how I use built-in HTTPS client.</em>
    * Controller for Demo 2
      * Demonstrate how I made request to third party API using standard library. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/controllers/cat.js)
* Demonstrate testing using Jest framework. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/tests/libs/router/insertRouter.js)

## Pre-requisite

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

Run server <sup id='run-server'>[1](#note-run-server)</sup>
```
npm start
```

## Run using Docker
Please use manual setup for now. I haven't completed this code. Decided not to push incomplete demo.
```
docker run --name demo-rest-api -d -p 3000:3000 leetbox/demo-rest-api:1.0
```

## Run test files

Test once
```
npm test
```

Automatically re-run test when there is changes
```
npm run watch-start
```

## Test API endpoints

Get welcome message.
```
GET /
```

Get a list of cat breeds.
```
Endpoint:
GET /cat/breeds

Queries (optional) :
- limit (int)
- page (int)
```

List cat images by breed.

```
Endpoint:
GET /cat/breed/{breed_id}/images

Queries (optional) :
- limit (int)
- page (int)
```

Upload cat image.

```
Endpoint:
POST /cat

Form Data (required) :
- file (file)
```

List only uploaded images.

```
Endpoint:
GET /cat

Queries (optional) :
- limit (int)
- page (int)
```

Get single image.

```
Endpoint:
GET /cat/{image_id}
```

Delete uploaded image.

```
Endpoint:
DELETE /cat/{image_id}
```

## License

See [LICENSE](https://github.com/ridhuanhassan/demo-rest-api/blob/main/LICENSE) for the full
license text.

## Footnote

<span id='note-run-server'>[1](#run-server)</span> Server will start at default port 3000. Port can be changed through environment variable PORT.
