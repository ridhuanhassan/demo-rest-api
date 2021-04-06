const fs = require('fs');
const https = require('https');
const qs = require('querystring');

const router = require('./router');
const helper = require('./helper');

const { logger } = helper;
const simple = Symbol.for('simple');

exports.init = () => {
  // create https server
  const server = https.createServer({
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  });

  server.on('request', (req, res) => {
    req.on('error', (error) => {
      logger.error(error.message);
      // TODO: log to file
    });

    const { method, url, headers } = req;

    const httpsURL = new URL(url, `https://${headers.host}`);
    const path = httpsURL.pathname;
    const query = qs.parse(httpsURL.searchParams.toString());
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const contentLength = req.headers['content-length'];
    const contentType = req.headers['content-type']?.split(';')[0].trim();

    // process static file
    if (url.match(/^\/static\/\S+|^\/static\/?$/)) {
      // lazy check, use file extension :')
      const fileContentType = helper.getContentType(url);

      if (fileContentType) {
        res.setHeader('content-type', fileContentType);
      } else {
        helper.sendErrorResponse(res, 'File not supported', 400);
        return;
      }

      const readFileStream = fs.createReadStream(`${__dirname}/..${url}`);

      readFileStream.on('error', (error) => {
        if (error.code === 'ENOENT' || error.code === 'EISDIR') {
          helper.sendErrorResponse(res, 'Url not found', 404);
        }
      });

      readFileStream.on('data', (chunk) => {
        res.statusCode = 200;

        res.write(chunk);
      });

      readFileStream.on('end', () => {
        res.end();
      });

      return;
    }

    let abortRequest = false;

    req.once('data', () => {
      const contentLimit = 5242880; // in bytes

      // limit content length
      if (contentLength > contentLimit) {
        res.setHeader('content-type', 'application/json');
        res.statusCode = 413;
        res.end(JSON.stringify({
          error: {
            message: 'Content exceeds 5 MB',
          },
        }));

        abortRequest = true;
      }

      // use encoding instead of plain buffer
      if (contentType === 'multipart/form-data') {
        // use latin1 encoding to parse binary files correctly
        req.setEncoding('latin1');
      } else {
        req.setEncoding('utf8');
      }
    });

    let body = '';

    req.on('data', (chunk) => {
      if (abortRequest) {
        return;
      }

      body += chunk;
    });

    req.on('end', () => {
      res.on('error', (error) => {
        logger.error(error.message);
        // TODO: log to file
      });

      if (!req[simple]) req[simple] = {};

      req[simple].method = method;
      req[simple].path = path;
      req[simple].headers = headers;
      req[simple].trimmedPath = trimmedPath;
      req[simple].query = query;

      if (contentType === 'multipart/form-data') {
        const boundary = req.headers['content-type']
          .split(';')[1]
          ?.split('=')[1]
          .trim();

        const bodyArray = body.split(boundary);

        const files = {};
        req[simple].body = {};

        let i = 0;
        const iMax = bodyArray.length;
        for (; i < iMax; i += 1) {
          const part = bodyArray[i];

          let name = part.match(/(?:name=")(.+?)(?:")/);

          if (!name) {
            continue;
          } else {
            name = name[1];
          }

          let content = part.match(/(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);

          if (content) {
            content = content[1];
          }

          let filename = part.match(/(?:filename=")(.*?)(?:")/);

          if (filename && (filename = filename[1].trim())) {
            let fileContentType = part
              .match(/(?:Content-Type:)(.*?)(?:\r\n)/);

            if (fileContentType) {
              fileContentType = fileContentType[1];
            } else {
              continue;
            }

            const file = {
              fieldName: name,
              originalFileName: filename,
              content: Buffer.from(content, 'binary'),
              contentType: fileContentType.trim(),
            };

            // multiple file, same name
            if (files[name] && !Array.isArray(files[name])) {
              files[name] = [
                files[name],
                file,
              ];
            } else if (files[name] && Array.isArray(files[name])) {
              files[name].push(file);
            } else {
              files[name] = file;
            }
          } else {
            req[simple].body[name] = content;
          }
        }

        req[simple].files = files;
      }

      if (contentType === 'application/json') {
        req[simple].body = JSON.parse(body);
      }

      if (contentType === 'application/x-www-form-urlencoded') {
        req[simple].body = qs.parse(body);
      }

      // send request to router
      router.process(req, res);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    logger.info(`REST API server started at port ${port}`);
  });

  return server;
};
