const https = require('https');

// const helper = require('../libs/helper');

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

        if (statusCode === 200 && contentType === 'application/json') {
          const jsonified = JSON.parse(result);

          if (Array.isArray(jsonified)) {
            const catBreeds = [];

            let i = 0;
            const iMax = jsonified.length;
            for (; i < iMax; i += 1) {
              catBreeds.push({
                id: jsonified[i].id,
                name: jsonified[i].name,
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

        if (statusCode === 200 && contentType === 'application/json') {
          const jsonified = JSON.parse(result);

          if (Array.isArray(jsonified)) {
            const images = [];

            let i = 0;
            const iMax = jsonified.length;
            for (; i < iMax; i += 1) {
              images.push(jsonified[i].url);
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

module.exports = cat;
