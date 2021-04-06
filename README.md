
# demo-rest-api

Demonstrate how I build REST API server using Node JS standard library without having to rely on any framework.

## Table of contents

* [Intro](#intro)
* [Manual setup](#manual-setup)
* [Pre-requisite](#pre-requisite)
* [Run server](#run-server)
* [Run using Docker](#run-using-docker)
* [Run test files](#run-test-files)
* [API endpoints](#api-endpoints)
* [Static files](#static-files)
* [Add your endpoint](#add-your-endpoint)
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
  * Demo 2. [Jump to file](https://github.com/ridhuanhassan/demo-rest-api/blob/main/routers/demo2.js), <em>Please note that this file contains only routers. Please see controller below to see how I utilized built-in HTTPS client.</em>
    * Controller for Demo 2
      * Demonstrate how I made request to third party API using standard library. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/controllers/cat.js). <em>** I don't want to spend my time to refactor the code right now.</em>
* Demonstrate testing using Jest framework. [Jump to file.](https://github.com/ridhuanhassan/demo-rest-api/blob/main/tests/libs/router/insertRouter.js)

## Pre-requisite

Tested on Node JS v14.16.0. So, you better use this version.

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

## API endpoints

I have included very few endpoints for test. These endpoints are there to prove that my REST API server works. You can add your own endpoint too by following the steps over [here](#add-your-endpoint).

Below are the available endpoints.

1. Get a list of cat breeds.

    ```
    Endpoint:
    GET /cat/breeds

    Query (optional) :
    - limit (int)
    - page (int)
    ```

2. List cat images by breed.

    ```
    Endpoint:
    GET /cat/breed/{breed_id}/images

    Query (optional) :
    - limit (int)
    - page (int)
    ```

3. Upload cat image.

    ```
    Endpoint:
    POST /cat

    Form Data (required) :
    - file (file)
    ```

4. List only uploaded images.

    ```
    Endpoint:
    GET /cat

    Query (optional) :
    - limit (int)
    - page (int)
    ```

5. Get single image.

    ```
    Endpoint:
    GET /cat/{image_id}
    ```

6. Delete uploaded image.

    ```
    Endpoint:
    DELETE /cat/{image_id}
    ```

## Static files
Here are list of static files endpoints I have included in this demo.

1.  ```
    /static/doc/test.xlsx
    ```
2.  ```
    /static/img/test.gif
    ```
3.  ```
    /static/img/test.jpg
    ```
4.  ```
    /static/img/test.png
    ```

You can also have your own static files hosted on this server by placing your static files inside `./static` folder.

Bear in mind, I only allow several [types](https://github.com/ridhuanhassan/demo-rest-api/blob/main/libs/helper.js#L73) of file for now and I didn't do deep checking to validate those file.
## Add your endpoint
1. From the root folder, create a file named `demo3.js` inside folder `./routers` .
    ```javascript
    touch routers/demo3.js
    ```
2. Inside `./routers/index.js`, import `demo3.js` by appending this line.
    ```javascript
    require('./demo3');
    ```
3. Inside `demo3.js`, import router library.
    ```javascript
    const router = require('../libs/router');
    ```
    <br>

    Next, create a router that handle HTTP `POST` request by calling `router.post(path, callback)`.
    
    `path` is the location of the resource that you want to expose and it starts with a simple forward slash `/` that indicates root directory.

    `callback` is a function that accepts two parameters which is request ([http.IncomingMessage](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage)) and response ([http.ServerResponse](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse)).


    ```javascript
    router.post('/report/:staffId', (request, response) => {
      // your code here ...
    });
    ```
    Currently, only `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` HTTP methods are supported.
    
    To change from `POST` to other HTTP methods, simply call `router.http_method_name_in_lower_case(path, callback)`. For example, if you want to handle a `GET` request, call `router.get(path, callback)`.
    <br><br>


    Next, if we want to read `query`, `params`, `body`, or `files` that are coming from a HTTP request. We can access it like this.

    ```javascript
    // include this line on top of your file
    const simple = Symbol.for('simple');

    router.post('/report/:staffId', (request, response) => {
      const body = req[simple].body;
      const params = req[simple].params;
      const query = req[simple].query;
      const files = req[simple].files;

      const staffId = params.staffId;
      
      // rest of the code ...
    });
    ```

    The purpose of using `Symbol` is to protect `query`, `body`, `params` and `files` from being accidentally overridden by mistakes. If you are wondering why the chosen name is `simple` is because I have a difficult time to name it and ended up with `simple` to not complicate my life. Just bear with it for this demo.

    `body` contains anything that can be sent from the body of a `multipart/form-data`, `application/json`, or `application/x-www-form-urlencoded` request.

    `params` contains values that replace any path segments that start with `:` .

    `query` contains any query that is part of the URL of the incoming request.

    `files` contains file that is sent from a `multipart/form-data` request. `files` supports multiple files in a single field.
    <br><br>

    If you have a request like this.
    ```
    curl --location --request POST 'https://localhost:3000/report/1008?signed=true' \
         --form 'reportFiles=@"/home/loot/file1.pdf"' \
         --form 'reportFiles=@"/home/loot/file2.pdf"' \
         --form 'reportType="annual"' \
         --form 'date="20201010"'
    ```
    Then, `req[simple]` will be an object containing these.
    ```javascript
    {
      body: {
        reportType: 'annual',
        date: '20201010',
      },
      params: {
        staffId: 1008,
      },
      query: {
        signed: 'true',
      },
      files: {
        reportFiles: [
          {
            fieldName: 'reportFiles',
            originalFileName: 'file1.pdf',
            content: Buffer, // expect a buffer
            contentType: 'application/pdf',
          },
          {
            fieldName: 'reportFiles',
            originalFileName: 'file1.pdf',
            content: Buffer,
            contentType: 'application/pdf',
          }
        ],
      }
    }
    ```
    Please note that, if you supplied one file for a single field, `file.reportFiles` will be an object containing the file data instead of Array of file datas.
    <br><br>

    Next, complete your code. For now, I am just going to output everything back as JSON. You should now have something like this.
    ```javascript
    const simple = Symbol.for('simple');

    router.post('/report/:staffId', (request, response) => {
      const body = req[simple].body;
      const params = req[simple].params;
      const query = req[simple].query;
      const files = req[simple].files;

      const data = {
        staffId: params.staffId,
        date: body.date,
        reportType: body.reportType,
        files: [
          files.reportFiles[0].originalFileName,
          files.reportFiles[1].originalFileName,
        ],
        signed: true,
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.write(JSON.stringify(data));
      res.end();
    });
    ```
4. Run server using `npm start` command. Test the endpoint to see if it works.

## License

See [LICENSE](https://github.com/ridhuanhassan/demo-rest-api/blob/main/LICENSE) for the full
license text.

## Footnote

<span id='note-run-server'>[1](#run-server)</span> Server will start at default port 3000. Port can be changed through environment variable PORT.
