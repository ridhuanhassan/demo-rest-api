// https://docs.thecatapi.com/api-reference
const https = require('https');
const { randomBytes } = require('crypto');

const helper = require('../libs/helper');

const cat = {};

const apiKey = process.env.CAT_KEY || '582af1e5-ae1d-4410-a0bd-81b167ebebcd';

cat.listBreeds = (input) => {
  const page = input.page || 0;
  const limit = input.limit || 10;

  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/breeds?limit=${limit}&page=${page ? page - 1 : 0}`,
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

        const jsonified = JSON.parse(result);

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
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
        } else {
          reject(new Error(jsonified.message));
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
  const page = input.page || 0;
  const limit = input.limit || 10;

  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/images/search?limit=${limit}&page=${page ? page - 1 : 0}&breed_id=${breedId}`,
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

        const jsonified = JSON.parse(result);

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
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
        } else {
          reject(new Error(jsonified.message));
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

  if (Array.isArray(file)) {
    return Promise.reject(new Error('Expecting single file'));
  }

  if (!helper.checkImageSignature(file.content, file.originalFileName)) {
    return Promise.reject(new Error('Image malformed'));
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

          const jsonified = JSON.parse(result);

          if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
            resolve({
              id: jsonified?.id,
              image: jsonified?.url,
            });
          } else {
            reject(new Error(jsonified.message));
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

cat.getUploadedImages = (input) => {
  const page = input.page || 0;
  const limit = input.limit || 10;

  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/images?limit=${limit}&page=${page ? page - 1 : 0}`,
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

        const jsonified = JSON.parse(result);

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
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
        } else {
          reject(new Error(jsonified.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

cat.getSingleImage = (input) => {
  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/images/${input.imageId}`,
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

        const jsonified = JSON.parse(result);

        if (Math.floor(statusCode / 100) === 2 && contentType === 'application/json') {
          resolve({
            id: jsonified.id,
            image: jsonified.url,
          });
        } else {
          reject(new Error(jsonified.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

cat.deleteImage = (input) => {
  const imageId = input.imageId;

  const options = {
    hostname: 'api.thecatapi.com',
    port: 443,
    path: `/v1/images/${imageId}`,
    method: 'DELETE',
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

        let jsonified;

        if (result) {
          jsonified = JSON.parse(result);
        }

        if (Math.floor(statusCode / 100) === 2) {
          resolve();
        } else {
          reject(new Error(jsonified.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

module.exports = cat;
