const https = require('https');
const { randomBytes } = require('crypto');

const cat = {};

const apiKey = process.env.CAT_KEY || '582af1e5-ae1d-4410-a0bd-81b167ebebcd';

cat.listBreeds = () => {
  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: '/v1/breeds',
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'].split(';')[0].trim();

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
          const jsonified = JSON.parse(result);

          if (Array.isArray(jsonified)) {
            const catBreeds = [];

            let i = 0;
            const iMax = jsonified.length;
            for (; i < iMax; i += 1) {
              catBreeds.push({
                id: jsonified[i]?.id,
                name: jsonified[i]?.name,
                image: jsonified[i]?.image?.url || 'n/a',
              });
            }

            resolve(catBreeds);
          }

          reject(new Error('Unexpected result'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

cat.imageByBreed = (input) => {
  const breedId = input.breedId;
  const page = input.page || 1;
  const limit = input.limit || 10;

  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/images/search?limit=${limit}&page=${page}&breed_id=${breedId}`,
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'].split(';')[0].trim();

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
          const jsonified = JSON.parse(result);

          if (Array.isArray(jsonified)) {
            const images = [];

            let i = 0;
            const iMax = jsonified.length;
            for (; i < iMax; i += 1) {
              images.push({
                id: jsonified[i]?.id,
                image: jsonified[i]?.url,
              });
            }

            resolve(images);
          }

          reject(new Error('Unexpected result'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

cat.uploadImage = (input) => {
  const file = input.file;

  if (!file) {
    return Promise.reject(new Error('Missing field \'file\''));
  }

  return new Promise((resolve, reject) => {
    randomBytes(5, (error, buf) => {
      if (error) Promise.reject(error);
      const boundary = buf.toString('hex');

      let data = '';
      data += `--${boundary}\r\n`;
      data += `Content-Disposition: form-data; name="file"; filename="${file.originalFileName}"\r\n`;
      data += `Content-Type:${file.contentType}\r\n\r\n`;
      const payload = Buffer.concat([
        Buffer.from(data, 'utf8'),
        Buffer.from(file.content, 'binary'),
        Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
      ]);

      const options = {
        hostname: 'api.thecatapi.com',
        port: 443,
        path: '/v1/images/upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': payload.length,
          'X-Api-Key': apiKey,
        },
      };

      const req = https.request(options, (res) => {
        let result = '';

        res.on('data', (chunk) => {
          result += chunk;
        });

        res.on('end', () => {
          const statusCode = res.statusCode;
          const contentType = res.headers['content-type'].split(';')[0].trim();

          if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
            const jsonified = JSON.parse(result);

            resolve({
              id: jsonified?.id,
              image: jsonified?.url,
            });
          }
        });
      });

      req.on('reqError', (reqError) => {
        reject(reqError);
      });

      req.write(payload);
      req.end();
    });
  });
};

module.exports = cat;
